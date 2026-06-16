export interface HouseholdConfig {
  salary: number;
  otherIncome: number;
  currentSavings: number;
  targetAmount: number;
  targetDate: string;
  monthlySavingsCapacity: number;
}

export interface WorkPayment {
  id: string;
  month: string;
  amount: number;
  description: string;
}

export interface ProjectionMonth {
  month: string;
  salaryTotal: number;
  otherIncome: number;
  worksPayment: number;
  savingsCapacity: number;
  actualSavings: number;
  kitchenFundStart: number;
  kitchenFundEnd: number;
  targetGap: number;
  scenario: string;
}

export interface ScenarioConfig {
  name: string;
  savingsModifier: number;
  bonusMonth?: string;
  bonusAmount?: number;
  description: string;
}

export interface ProjectionResult {
  months: ProjectionMonth[];
  targetReached: boolean;
  reachDate?: string;
  finalAmount: number;
  finalGap: number;
  requiredMonthlySavings: number;
}
