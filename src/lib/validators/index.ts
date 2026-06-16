import { HouseholdConfig, WorkPayment } from '@/types';

export function validateConfig(config: HouseholdConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (config.salary < 0) {
    errors.push('Le salaire ne peut pas être négatif');
  }
  
  if (config.otherIncome < 0) {
    errors.push('Les revenus annexes ne peuvent pas être négatifs');
  }
  
  if (config.currentSavings < 0) {
    errors.push('L\'épargne actuelle ne peut pas être négative');
  }
  
  if (config.targetAmount <= 0) {
    errors.push('Le montant cible doit être positif');
  }
  
  if (config.monthlySavingsCapacity < 0) {
    errors.push('La capacité d\'épargne mensuelle ne peut pas être négative');
  }
  
  const targetDate = new Date(config.targetDate);
  const now = new Date();
  if (targetDate <= now) {
    errors.push('La date cible doit être dans le futur');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

export function validateWorkPayment(payment: WorkPayment): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (payment.amount < 0) {
    errors.push('Le montant du paiement ne peut pas être négatif');
  }
  
  if (!payment.month || !/^\d{4}-\d{2}$/.test(payment.month)) {
    errors.push('Le mois doit être au format YYYY-MM');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
