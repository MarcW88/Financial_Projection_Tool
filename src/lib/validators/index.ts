import { HouseholdConfig, MonthlyAdjustment } from '@/types';

export function validateConfig(config: HouseholdConfig): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (config.baseNetIncome < 0) {
    errors.push('Le revenu net de base ne peut pas être négatif');
  }
  
  if (config.currentSavings < 0) {
    errors.push('L\'épargne actuelle ne peut pas être négative');
  }
  
  if (config.targetAmount <= 0) {
    errors.push('Le montant cible doit être positif');
  }
  
  const targetDate = new Date(config.targetDate);
  const now = new Date();
  if (targetDate <= now) {
    errors.push('La date cible doit être dans le futur');
  }
  
  // Warnings métier
  if (config.currentSavings >= config.targetAmount) {
    warnings.push('L\'épargne actuelle est déjà supérieure ou égale à l\'objectif');
  }
  
  if (config.baseNetIncome === 0) {
    warnings.push('Le revenu net de base est à 0€');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function validateMonthlyAdjustment(adjustment: MonthlyAdjustment, targetDate: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (!adjustment.month || !/^\d{4}-\d{2}$/.test(adjustment.month)) {
    errors.push('Le mois doit être au format YYYY-MM');
  }
  
  if (adjustment.additionalIncome < 0) {
    errors.push('Les revenus additionnels ne peuvent pas être négatifs');
  }
  
  if (adjustment.additionalCosts < 0) {
    errors.push('Les coûts additionnels ne peuvent pas être négatifs');
  }
  
  // Vérifier que le mois n'est pas après la date cible
  const adjustmentDate = new Date(adjustment.month + '-01');
  const target = new Date(targetDate);
  if (adjustmentDate > target) {
    errors.push('Le mois de l\'ajustement ne peut pas être après la date cible');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
