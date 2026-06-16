import { useState, useCallback } from 'react';
import { HouseholdConfig, WorkPayment, ProjectionResult, ScenarioConfig } from '@/types';
import { buildProjection } from '@/lib/calculators/projection';
import { runScenario, defaultScenarios } from '@/lib/scenarios';
import { validateConfig } from '@/lib/validators';

export function useProjection() {
  const [config, setConfig] = useState<HouseholdConfig>({
    salary: 0,
    otherIncome: 0,
    currentSavings: 0,
    targetAmount: 0,
    targetDate: '2026-12-31',
    monthlySavingsCapacity: 0
  });
  
  const [workPayments, setWorkPayments] = useState<WorkPayment[]>([]);
  const [projection, setProjection] = useState<ProjectionResult | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<string, ProjectionResult>>({});
  const [selectedScenario, setSelectedScenario] = useState<string>('realiste');
  const [errors, setErrors] = useState<string[]>([]);

  const updateConfig = useCallback((newConfig: Partial<HouseholdConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const addWorkPayment = useCallback((payment: WorkPayment) => {
    setWorkPayments(prev => [...prev, payment]);
  }, []);

  const removeWorkPayment = useCallback((id: string) => {
    setWorkPayments(prev => prev.filter(wp => wp.id !== id));
  }, []);

  const updateWorkPayment = useCallback((id: string, updates: Partial<WorkPayment>) => {
    setWorkPayments(prev => prev.map(wp => 
      wp.id === id ? { ...wp, ...updates } : wp
    ));
  }, []);

  const calculateProjection = useCallback(() => {
    const validation = validateConfig(config);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    setErrors([]);
    const result = buildProjection(config, workPayments);
    setProjection(result);
    
    // Calculate all scenarios
    const results: Record<string, ProjectionResult> = {};
    defaultScenarios.forEach(scenario => {
      results[scenario.name] = runScenario(config, scenario, workPayments);
    });
    setScenarioResults(results);
  }, [config, workPayments]);

  return {
    config,
    updateConfig,
    workPayments,
    addWorkPayment,
    removeWorkPayment,
    updateWorkPayment,
    projection,
    scenarioResults,
    selectedScenario,
    setSelectedScenario,
    calculateProjection,
    errors,
    scenarios: defaultScenarios
  };
}
