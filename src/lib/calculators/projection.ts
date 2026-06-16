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
  
  // Calculate target track (linear progression from currentSavings to targetAmount)
  const currentDate = new Date(startDate);
  currentDate.setDate(1);
  
  const totalMonths: number[] = [];
  let tempDate = new Date(currentDate);
  while (tempDate <= targetDate) {
    totalMonths.push(tempDate.getTime());
    tempDate.setMonth(tempDate.getMonth() + 1);
  }
  
  const totalMonthsCount = totalMonths.length;
  const startAmount = config.currentSavings;
  const endAmount = config.targetAmount;
  const monthlyTargetIncrement = (endAmount - startAmount) / totalMonthsCount;
  
  let monthIndex = 0;
  
  while (currentDate <= targetDate) {
    const monthStr = currentDate.toISOString().slice(0, 7);
    
    // Find monthly adjustment for this month
    const adjustment = monthlyAdjustments.find(ma => ma.month === monthStr);
    const additionalIncome = adjustment?.additionalIncome || 0;
    const additionalCosts = adjustment?.additionalCosts || 0;
    
    // Calculate monthly contribution
    const baseIncome = config.baseNetIncome;
    const monthlyContribution = Math.max(0, baseIncome + additionalIncome - additionalCosts);
    
    const fundStart = currentFund;
    currentFund += monthlyContribution;
    const fundEnd = currentFund;
    
    const remainingToTarget = config.targetAmount - fundEnd;
    
    // Calculate target track fund (theoretical linear progression)
    const targetTrackFund = startAmount + (monthlyTargetIncrement * (monthIndex + 1));
    const gapVsTrack = fundEnd - targetTrackFund;
    
    months.push({
      month: monthStr,
      baseIncome,
      additionalIncome,
      additionalCosts,
      monthlyContribution,
      kitchenFundStart: fundStart,
      kitchenFundEnd: fundEnd,
      remainingToTarget,
      targetTrackFund,
      gapVsTrack,
      scenario: 'base'
    });
    
    if (!targetReached && fundEnd >= config.targetAmount) {
      targetReached = true;
      reachDate = monthStr;
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
    monthIndex++;
  }
  
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
