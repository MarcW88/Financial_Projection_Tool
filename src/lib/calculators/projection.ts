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
  
  return {
    months,
    targetReached,
    reachDate,
    finalAmount,
    finalGap
  };
}
