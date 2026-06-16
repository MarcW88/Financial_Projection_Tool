export interface HouseholdConfig {
  baseNetIncome: number;
  currentSavings: number;
  targetAmount: number;
  targetDate: string;
}

export interface MonthlyAdjustment {
  id: string;
  month: string;
  additionalIncome: number;
  additionalCosts: number;
  note?: string;
}

export interface ProjectionMonth {
  month: string;
  period: string;
  baseIncome: number;
  additionalIncome: number;
  additionalCosts: number;
  weeklyContribution: number;
  kitchenFundStart: number;
  kitchenFundEnd: number;
  remainingToTarget: number;
  targetTrackFund: number;
  gapVsTrack: number;
  scenario: string;
  projectedTrajectory?: number;
}

export interface ScenarioConfig {
  name: string;
  incomeAdjustmentFactor?: number;
  costAdjustmentFactor?: number;
  bonusMonth?: string;
  bonusAmount?: number;
  extraCostMonth?: string;
  extraCostAmount?: number;
  description: string;
}

export interface ProjectionResult {
  months: ProjectionMonth[];
  targetReached: boolean;
  reachDate?: string;
  finalAmount: number;
  finalGap: number;
}

export type Section = 'projection' | 'donnees' | 'scenarios' | 'parametres';
