import { useState, useCallback } from 'react';
import { HouseholdConfig, MonthlyAdjustment, ProjectionResult, ScenarioConfig } from '@/types';
import { buildProjection } from '@/lib/calculators/projection';
import { runScenario, defaultScenarios } from '@/lib/scenarios';
import { validateConfig } from '@/lib/validators';

export function useProjection() {
  const [config, setConfig] = useState<HouseholdConfig>({
    baseNetIncome: 2600,
    currentSavings: 14000,
    targetAmount: 52000,
    targetDate: '2026-12-31'
  });
  
  const [monthlyAdjustments, setMonthlyAdjustments] = useState<MonthlyAdjustment[]>([]);
  const [projection, setProjection] = useState<ProjectionResult | null>(null);
  const [scenarioResults, setScenarioResults] = useState<Record<string, ProjectionResult>>({});
  const [selectedScenario, setSelectedScenario] = useState<string>('realiste');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const updateConfig = useCallback((newConfig: Partial<HouseholdConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const addMonthlyAdjustment = useCallback((adjustment: MonthlyAdjustment) => {
    setMonthlyAdjustments(prev => [...prev, adjustment]);
  }, []);

  const removeMonthlyAdjustment = useCallback((id: string) => {
    setMonthlyAdjustments(prev => prev.filter(ma => ma.id !== id));
  }, []);

  const updateMonthlyAdjustment = useCallback((id: string, updates: Partial<MonthlyAdjustment>) => {
    setMonthlyAdjustments(prev => prev.map(ma => 
      ma.id === id ? { ...ma, ...updates } : ma
    ));
  }, []);

  const calculateProjection = useCallback(() => {
    const validation = validateConfig(config);
    if (!validation.valid) {
      setErrors(validation.errors);
      setWarnings(validation.warnings);
      return;
    }
    
    setErrors([]);
    setWarnings(validation.warnings);
    const result = buildProjection(config, monthlyAdjustments);
    setProjection(result);
    
    // Calculate all scenarios
    const results: Record<string, ProjectionResult> = {};
    defaultScenarios.forEach(scenario => {
      results[scenario.name] = runScenario(config, scenario, monthlyAdjustments);
    });
    setScenarioResults(results);
  }, [config, monthlyAdjustments]);

  return {
    config,
    updateConfig,
    monthlyAdjustments,
    addMonthlyAdjustment,
    removeMonthlyAdjustment,
    updateMonthlyAdjustment,
    projection,
    scenarioResults,
    selectedScenario,
    setSelectedScenario,
    calculateProjection,
    errors,
    warnings,
    scenarios: defaultScenarios
  };
}
