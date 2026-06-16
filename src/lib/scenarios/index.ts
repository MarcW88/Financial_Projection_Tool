import { HouseholdConfig, ScenarioConfig, ProjectionResult } from '@/types';
import { buildProjection } from '../calculators/projection';

export const defaultScenarios: ScenarioConfig[] = [
  {
    name: 'prudent',
    savingsModifier: 0.8,
    description: 'Capacité d\'épargne réduite de 20%'
  },
  {
    name: 'realiste',
    savingsModifier: 1.0,
    description: 'Capacité d\'épargne actuelle'
  },
  {
    name: 'ambitieux',
    savingsModifier: 1.2,
    description: 'Capacité d\'épargne augmentée de 20%'
  },
  {
    name: 'bonus',
    savingsModifier: 1.0,
    bonusMonth: '2026-12',
    bonusAmount: 1000,
    description: 'Bonus de fin d\'année'
  }
];

export function runScenario(
  baseConfig: HouseholdConfig,
  scenario: ScenarioConfig,
  workPayments: any[]
): ProjectionResult {
  const modifiedConfig = {
    ...baseConfig,
    monthlySavingsCapacity: baseConfig.monthlySavingsCapacity * scenario.savingsModifier
  };
  
  const result = buildProjection(modifiedConfig, workPayments);
  
  // Apply bonus if specified
  if (scenario.bonusMonth && scenario.bonusAmount) {
    const bonusMonthIndex = result.months.findIndex(m => m.month === scenario.bonusMonth);
    if (bonusMonthIndex !== -1) {
      result.months[bonusMonthIndex].actualSavings += scenario.bonusAmount;
      result.months[bonusMonthIndex].kitchenFundEnd += scenario.bonusAmount;
      result.months[bonusMonthIndex].targetGap -= scenario.bonusAmount;
      
      // Recalculate subsequent months
      for (let i = bonusMonthIndex + 1; i < result.months.length; i++) {
        result.months[i].kitchenFundStart = result.months[i - 1].kitchenFundEnd;
        result.months[i].kitchenFundEnd = result.months[i].kitchenFundStart + result.months[i].actualSavings;
        result.months[i].targetGap = baseConfig.targetAmount - result.months[i].kitchenFundEnd;
      }
      
      // Update final results
      const finalMonth = result.months[result.months.length - 1];
      result.finalAmount = finalMonth.kitchenFundEnd;
      result.finalGap = baseConfig.targetAmount - finalMonth.kitchenFundEnd;
      result.targetReached = finalMonth.kitchenFundEnd >= baseConfig.targetAmount;
      if (result.targetReached) {
        result.reachDate = result.months.find(m => m.kitchenFundEnd >= baseConfig.targetAmount)?.month;
      }
    }
  }
  
  return result;
}
