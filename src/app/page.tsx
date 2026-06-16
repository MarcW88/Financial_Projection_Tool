'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useProjection } from '@/hooks/useProjection';
import { ProjectionLineChart } from '@/components/charts/ProjectionLineChart';
import { CashflowBarChart } from '@/components/charts/CashflowBarChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Home() {
  const {
    config,
    updateConfig,
    monthlyAdjustments,
    addMonthlyAdjustment,
    removeMonthlyAdjustment,
    projection,
    scenarioResults,
    selectedScenario,
    setSelectedScenario,
    calculateProjection,
    errors,
    warnings,
    scenarios
  } = useProjection();

  const [newAdjustment, setNewAdjustment] = useState({
    month: '',
    additionalIncome: 0,
    additionalCosts: 0,
    note: ''
  });

  const handleAddAdjustment = () => {
    if (newAdjustment.month) {
      addMonthlyAdjustment({
        id: Date.now().toString(),
        month: newAdjustment.month,
        additionalIncome: newAdjustment.additionalIncome,
        additionalCosts: newAdjustment.additionalCosts,
        note: newAdjustment.note
      });
      setNewAdjustment({ month: '', additionalIncome: 0, additionalCosts: 0, note: '' });
    }
  };

  const currentProjection = selectedScenario === 'realiste' 
    ? projection 
    : scenarioResults[selectedScenario];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Projection Épargne Cuisine</h1>
        <p className="text-gray-400 mb-8">Objectif: Décembre 2026</p>

        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            {errors.map((error, i) => (
              <p key={i} className="text-red-200">{error}</p>
            ))}
          </div>
        )}

        {warnings.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-500 rounded-lg">
            {warnings.map((warning, i) => (
              <p key={i} className="text-yellow-200">{warning}</p>
            ))}
          </div>
        )}

        <Tabs defaultValue="parametres" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            <TabsTrigger value="ajustements">Ajustements mensuels</TabsTrigger>
            <TabsTrigger value="projection">Projection</TabsTrigger>
            <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
          </TabsList>

          <TabsContent value="parametres" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Configuration du ménage</CardTitle>
                <CardDescription>Entrez vos revenus de base et objectifs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Revenu net mensuel de base (€)</Label>
                    <Input
                      type="number"
                      value={config.baseNetIncome}
                      onChange={(e) => updateConfig({ baseNetIncome: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Épargne actuelle (€)</Label>
                    <Input
                      type="number"
                      value={config.currentSavings}
                      onChange={(e) => updateConfig({ currentSavings: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Objectif cuisine (€)</Label>
                    <Input
                      type="number"
                      value={config.targetAmount}
                      onChange={(e) => updateConfig({ targetAmount: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Date cible</Label>
                    <Input
                      type="date"
                      value={config.targetDate}
                      onChange={(e) => updateConfig({ targetDate: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <Button onClick={calculateProjection} className="w-full">
                  Calculer la projection
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ajustements" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Ajustements mensuels</CardTitle>
                <CardDescription>Ajoutez des revenus additionnels ou coûts par mois</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Label>Mois (YYYY-MM)</Label>
                    <Input
                      type="text"
                      placeholder="2025-06"
                      value={newAdjustment.month}
                      onChange={(e) => setNewAdjustment({ ...newAdjustment, month: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Revenus additionnels (€)</Label>
                    <Input
                      type="number"
                      value={newAdjustment.additionalIncome}
                      onChange={(e) => setNewAdjustment({ ...newAdjustment, additionalIncome: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Coûts additionnels (€)</Label>
                    <Input
                      type="number"
                      value={newAdjustment.additionalCosts}
                      onChange={(e) => setNewAdjustment({ ...newAdjustment, additionalCosts: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Note</Label>
                    <Input
                      type="text"
                      value={newAdjustment.note}
                      onChange={(e) => setNewAdjustment({ ...newAdjustment, note: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <Button onClick={handleAddAdjustment}>Ajouter ajustement</Button>
                
                <div className="space-y-2 mt-4">
                  {monthlyAdjustments.map((adjustment) => (
                    <div key={adjustment.id} className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <span className="font-medium">{adjustment.month}</span>
                        {adjustment.note && <span className="ml-2 text-gray-400">{adjustment.note}</span>}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-green-400">+{adjustment.additionalIncome}€</span>
                        <span className="text-red-400">-{adjustment.additionalCosts}€</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeMonthlyAdjustment(adjustment.id)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projection" className="space-y-4">
            {projection && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardDescription>Objectif</CardDescription>
                      <CardTitle className="text-2xl">{config.targetAmount.toLocaleString()}€</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardDescription>Montant projeté</CardDescription>
                      <CardTitle className="text-2xl">{projection.finalAmount.toLocaleString()}€</CardTitle>
                    </CardHeader>
                  </Card>
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardDescription>Écart</CardDescription>
                      <CardTitle className={`text-2xl ${projection.finalGap >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {projection.finalGap.toLocaleString()}€
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Projection de l'épargne vs trajectoire cible</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ProjectionLineChart data={projection.months} targetAmount={config.targetAmount} />
                  </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Flux de trésorerie mensuel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CashflowBarChart data={projection.months} />
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Comparaison de scénarios</CardTitle>
                <CardDescription>Testez différentes hypothèses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  {scenarios.map((scenario) => (
                    <Button
                      key={scenario.name}
                      variant={selectedScenario === scenario.name ? 'default' : 'outline'}
                      onClick={() => setSelectedScenario(scenario.name)}
                    >
                      {scenario.name}
                    </Button>
                  ))}
                </div>

                {currentProjection && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="bg-zinc-800 border-zinc-700">
                        <CardHeader>
                          <CardDescription>Montant final</CardDescription>
                          <CardTitle className="text-xl">{currentProjection.finalAmount.toLocaleString()}€</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="bg-zinc-800 border-zinc-700">
                        <CardHeader>
                          <CardDescription>Écart</CardDescription>
                          <CardTitle className={`text-xl ${currentProjection.finalGap >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {currentProjection.finalGap.toLocaleString()}€
                          </CardTitle>
                        </CardHeader>
                      </Card>
                      <Card className="bg-zinc-800 border-zinc-700">
                        <CardHeader>
                          <CardDescription>Objectif atteint</CardDescription>
                          <CardTitle className={`text-xl ${currentProjection.targetReached ? 'text-green-500' : 'text-red-500'}`}>
                            {currentProjection.targetReached ? 'Oui' : 'Non'}
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </div>

                    <Card className="bg-zinc-800 border-zinc-700">
                      <CardHeader>
                        <CardTitle>Projection - Scénario {selectedScenario}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProjectionLineChart data={currentProjection.months} targetAmount={config.targetAmount} />
                      </CardContent>
                    </Card>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
