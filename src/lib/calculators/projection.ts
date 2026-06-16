import { HouseholdConfig, WorkPayment, ProjectionMonth, ProjectionResult } from '@/types';

export function buildProjection(
  config: HouseholdConfig,
  workPayments: WorkPayment[]
): ProjectionResult {
  const startDate = new Date();
  const targetDate = new Date(config.targetDate);
  
  const months: ProjectionMonth[] = [];
  let currentFund = config.currentSavings;
  let targetReached = false;
  let reachDate: string | undefined;
  
  const currentDate = new Date(startDate);
  currentDate.setDate(1); // Set to first of month
  
  while (currentDate <= targetDate) {
    const monthStr = currentDate.toISOString().slice(0, 7);
    
    // Find work payments for this month
    const monthWorkPayments = workPayments.filter(wp => wp.month === monthStr);
    const totalWorkPayment = monthWorkPayments.reduce((sum, wp) => sum + wp.amount, 0);
    
    // Calculate savings
    const salaryTotal = config.salary + config.otherIncome;
    const savingsCapacity = config.monthlySavingsCapacity;
    const actualSavings = Math.max(0, savingsCapacity - totalWorkPayment);
    
    const fundStart = currentFund;
    currentFund += actualSavings;
    const fundEnd = currentFund;
    
    const targetGap = config.targetAmount - fundEnd;
    
    months.push({
      month: monthStr,
      salaryTotal,
      otherIncome: config.otherIncome,
      worksPayment: totalWorkPayment,
      savingsCapacity,
      actualSavings,
      kitchenFundStart: fundStart,
      kitchenFundEnd: fundEnd,
      targetGap,
      scenario: 'base'
    });
    
    if (!targetReached && fundEnd >= config.targetAmount) {
      targetReached = true;
      reachDate = monthStr;
    }
    
    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }
  
  const finalMonth = months[months.length - 1];
  const finalAmount = finalMonth.kitchenFundEnd;
  const finalGap = config.targetAmount - finalAmount;
  
  // Calculate required monthly savings to reach target
  const remainingMonths = months.length;
  const remainingAmount = config.targetAmount - config.currentSavings;
  const totalWorkPayments = workPayments.reduce((sum, wp) => sum + wp.amount, 0);
  const requiredMonthlySavings = (remainingAmount + totalWorkPayments) / remainingMonths;
  
  return {
    months,
    targetReached,
    reachDate,
    finalAmount,
    finalGap,
    requiredMonthlySavings
  };
}

export function calculateRequiredMonthlySavings(
  currentSavings: number,
  targetAmount: number,
  months: number,
  totalWorkPayments: number
): number {
  const remainingAmount = targetAmount - currentSavings;
  return (remainingAmount + totalWorkPayments) / months;
}
