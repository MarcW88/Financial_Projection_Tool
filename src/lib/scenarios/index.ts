import { HouseholdConfig, ScenarioConfig, ProjectionResult, MonthlyAdjustment } from '@/types';
import { buildProjection } from '../calculators/projection';

export const defaultScenarios: ScenarioConfig[] = [
  {
    name: 'prudent',
    costAdjustmentFactor: 1.3,
    description: 'Coûts additionnels majorés de 30%'
  },
  {
    name: 'realiste',
    description: 'Données telles quelles'
  },
  {
    name: 'ambitieux',
    incomeAdjustmentFactor: 1.2,
    costAdjustmentFactor: 0.8,
    description: 'Revenus +20%, coûts -20%'
  },
  {
    name: 'bonus',
    bonusMonth: '2026-12',
    bonusAmount: 1000,
    description: 'Bonus de fin d\'année de 1000€'
  }
];

export function runScenario(
  baseConfig: HouseholdConfig,
  scenario: ScenarioConfig,
  monthlyAdjustments: MonthlyAdjustment[]
): ProjectionResult {
  // Clone monthly adjustments to avoid mutating original
  const adjustedMonthlyAdjustments = monthlyAdjustments.map(ma => ({
    ...ma,
    additionalIncome: ma.additionalIncome * (scenario.incomeAdjustmentFactor || 1),
    additionalCosts: ma.additionalCosts * (scenario.costAdjustmentFactor || 1)
  }));
  
  // Apply bonus if specified
  if (scenario.bonusMonth && scenario.bonusAmount) {
    const bonusMonthIndex = adjustedMonthlyAdjustments.findIndex(ma => ma.month === scenario.bonusMonth);
    if (bonusMonthIndex !== -1) {
      adjustedMonthlyAdjustments[bonusMonthIndex] = {
        ...adjustedMonthlyAdjustments[bonusMonthIndex],
        additionalIncome: adjustedMonthlyAdjustments[bonusMonthIndex].additionalIncome + scenario.bonusAmount
      };
    } else {
      // Create new adjustment for bonus month if it doesn't exist
      adjustedMonthlyAdjustments.push({
        id: `bonus-${scenario.bonusMonth}`,
        month: scenario.bonusMonth,
        additionalIncome: scenario.bonusAmount,
        additionalCosts: 0,
        note: 'Bonus scénario'
      });
    }
  }
  
  // Apply extra cost if specified
  if (scenario.extraCostMonth && scenario.extraCostAmount) {
    const extraCostMonthIndex = adjustedMonthlyAdjustments.findIndex(ma => ma.month === scenario.extraCostMonth);
    if (extraCostMonthIndex !== -1) {
      adjustedMonthlyAdjustments[extraCostMonthIndex] = {
        ...adjustedMonthlyAdjustments[extraCostMonthIndex],
        additionalCosts: adjustedMonthlyAdjustments[extraCostMonthIndex].additionalCosts + scenario.extraCostAmount
      };
    } else {
      // Create new adjustment for extra cost month if it doesn't exist
      adjustedMonthlyAdjustments.push({
        id: `extracost-${scenario.extraCostMonth}`,
        month: scenario.extraCostMonth,
        additionalIncome: 0,
        additionalCosts: scenario.extraCostAmount,
        note: 'Coût exceptionnel scénario'
      });
    }
  }
  
  // Run projection with adjusted monthly data
  const result = buildProjection(baseConfig, adjustedMonthlyAdjustments);
  
  // Update scenario name in result
  result.months = result.months.map(month => ({
    ...month,
    scenario: scenario.name
  }));
  
  return result;
}
