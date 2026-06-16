import { HouseholdConfig, MonthlyAdjustment, ProjectionMonth, ProjectionResult } from '@/types';

export function buildProjection(
  config: HouseholdConfig,
  monthlyAdjustments: MonthlyAdjustment[]
): ProjectionResult {
  const startDate = new Date();
  const targetDate = new Date(config.targetDate);
  
  const months: ProjectionMonth[] = [];
  let currentFund = config.currentSavings;
  let targetReached = false;
  let reachDate: string | undefined;
  
  const weekStarts: Date[] = [];
  const weekDuration = 7 * 24 * 60 * 60 * 1000;
  let currentWeekStart = new Date(startDate);
  currentWeekStart.setHours(0, 0, 0, 0);

  while (currentWeekStart <= targetDate) {
    weekStarts.push(new Date(currentWeekStart));
    currentWeekStart = new Date(currentWeekStart.getTime() + weekDuration);
  }

  const weeksByMonth = new Map<string, number>();
  weekStarts.forEach((weekStart) => {
    const monthKey = weekStart.toISOString().slice(0, 7);
    weeksByMonth.set(monthKey, (weeksByMonth.get(monthKey) || 0) + 1);
  });

  const startAmount = config.currentSavings;
  const totalWeeksCount = weekStarts.length;
  const weeklyTargetIncrement = (config.targetAmount - startAmount) / totalWeeksCount;

  weekStarts.forEach((weekStart, index) => {
    const monthKey = weekStart.toISOString().slice(0, 7);
    const weekOfMonth = Math.floor((weekStart.getDate() - 1) / 7) + 1;
    const period = `${weekStart.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} S${weekOfMonth}`;

    const adjustment = monthlyAdjustments.find(ma => ma.month === monthKey);
    const weeksInMonth = weeksByMonth.get(monthKey) || 1;
    const weeklyBaseIncome = config.baseNetIncome / weeksInMonth;
    const weeklyAdditionalIncome = adjustment?.additionalIncome ? adjustment.additionalIncome / weeksInMonth : 0;
    const weeklyAdditionalCosts = adjustment?.additionalCosts ? adjustment.additionalCosts / weeksInMonth : 0;
    const weeklyContribution = Math.max(0, weeklyBaseIncome + weeklyAdditionalIncome - weeklyAdditionalCosts);

    const fundStart = currentFund;
    currentFund += weeklyContribution;
    const fundEnd = currentFund;
    const remainingToTarget = config.targetAmount - fundEnd;
    const targetTrackFund = startAmount + weeklyTargetIncrement * (index + 1);
    const gapVsTrack = fundEnd - targetTrackFund;

    months.push({
      month: monthKey,
      period,
      baseIncome: weeklyBaseIncome,
      additionalIncome: weeklyAdditionalIncome,
      additionalCosts: weeklyAdditionalCosts,
      weeklyContribution,
      kitchenFundStart: fundStart,
      kitchenFundEnd: fundEnd,
      remainingToTarget,
      targetTrackFund,
      gapVsTrack,
      scenario: 'base'
    });

    if (!targetReached && fundEnd >= config.targetAmount) {
      targetReached = true;
      reachDate = period;
    }
  });

  const finalMonth = months[months.length - 1];
  const finalAmount = finalMonth.kitchenFundEnd;
  const finalGap = config.targetAmount - finalAmount;
  
  // Compute projected trajectory using a rolling average of recent weekly contributions
  const windowSize = 4; // last 4 weeks
  let cumulative = startAmount;
  for (let i = 0; i < months.length; i++) {
    const startIdx = Math.max(0, i - windowSize + 1);
    const slice = months.slice(startIdx, i + 1);
    const avg = slice.reduce((s, it) => s + it.weeklyContribution, 0) / Math.max(1, slice.length);
    cumulative += avg;
    months[i].projectedTrajectory = cumulative;
  }

  // If target not reached by targetDate, estimate the month when it would be reached
  let estimatedReachMonth: string | undefined = undefined;
  if (!targetReached) {
    // average recent weekly contributions
    const recent = months.slice(-windowSize).map(m => m.weeklyContribution);
    const avgWeekly = recent.reduce((s, v) => s + v, 0) / Math.max(1, recent.length);

    if (avgWeekly > 0) {
      let extraWeekStart = weekStarts[weekStarts.length - 1] ? new Date(weekStarts[weekStarts.length - 1].getTime() + weekDuration) : new Date(startDate.getTime() + weekDuration);
      let extraCumulative = finalAmount;
      const maxExtraWeeks = 52 * 5; // cap to 5 years
      for (let i = 0; i < maxExtraWeeks && extraCumulative < config.targetAmount; i++) {
        const monthKey = extraWeekStart.toISOString().slice(0, 7);
        const weekOfMonth = Math.floor((extraWeekStart.getDate() - 1) / 7) + 1;
        const period = `${extraWeekStart.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })} S${weekOfMonth}`;
        const weeksInMonth = weeksByMonth.get(monthKey) || 4;
        const weeklyBaseIncome = config.baseNetIncome / weeksInMonth;
        const adjustment = monthlyAdjustments.find(ma => ma.month === monthKey);
        const weeklyAdditionalIncome = adjustment?.additionalIncome ? adjustment.additionalIncome / weeksInMonth : 0;
        const weeklyAdditionalCosts = adjustment?.additionalCosts ? adjustment.additionalCosts / weeksInMonth : 0;
        // use recent average to be conservative about future contributions
        const weeklyContribution = Math.max(0, avgWeekly);

        const fundStart = extraCumulative;
        extraCumulative += weeklyContribution;
        const fundEnd = extraCumulative;

        months.push({
          month: monthKey,
          period,
          baseIncome: weeklyBaseIncome,
          additionalIncome: weeklyAdditionalIncome,
          additionalCosts: weeklyAdditionalCosts,
          weeklyContribution,
          kitchenFundStart: fundStart,
          kitchenFundEnd: fundEnd,
          remainingToTarget: config.targetAmount - fundEnd,
          targetTrackFund: config.targetAmount,
          gapVsTrack: fundEnd - config.targetAmount,
          scenario: 'projection'
        });

        if (fundEnd >= config.targetAmount) {
          estimatedReachMonth = period;
          break;
        }

        extraWeekStart = new Date(extraWeekStart.getTime() + weekDuration);
      }
    }
  }

  return {
    months,
    targetReached,
    reachDate,
    estimatedReachMonth,
    finalAmount,
    finalGap
  };
}

