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
    workPayments,
    addWorkPayment,
    removeWorkPayment,
    projection,
    scenarioResults,
    selectedScenario,
    setSelectedScenario,
    calculateProjection,
    errors,
    scenarios
  } = useProjection();

  const [newWorkPayment, setNewWorkPayment] = useState({
    month: '',
    amount: 0,
    description: ''
  });

  const handleAddWorkPayment = () => {
    if (newWorkPayment.month && newWorkPayment.amount > 0) {
      addWorkPayment({
        id: Date.now().toString(),
        month: newWorkPayment.month,
        amount: newWorkPayment.amount,
        description: newWorkPayment.description
      });
      setNewWorkPayment({ month: '', amount: 0, description: '' });
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

        <Tabs defaultValue="parametres" className="space-y-6">
          <TabsList className="bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="parametres">Paramètres</TabsTrigger>
            <TabsTrigger value="travaux">Travaux</TabsTrigger>
            <TabsTrigger value="projection">Projection</TabsTrigger>
            <TabsTrigger value="scenarios">Scénarios</TabsTrigger>
          </TabsList>

          <TabsContent value="parametres" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Configuration du ménage</CardTitle>
                <CardDescription>Entrez vos revenus et objectifs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Salaire mensuel (€)</Label>
                    <Input
                      type="number"
                      value={config.salary}
                      onChange={(e) => updateConfig({ salary: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Revenus annexes (€)</Label>
                    <Input
                      type="number"
                      value={config.otherIncome}
                      onChange={(e) => updateConfig({ otherIncome: Number(e.target.value) })}
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
                    <Label>Capacité épargne mensuelle (€)</Label>
                    <Input
                      type="number"
                      value={config.monthlySavingsCapacity}
                      onChange={(e) => updateConfig({ monthlySavingsCapacity: Number(e.target.value) })}
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

          <TabsContent value="travaux" className="space-y-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>Paiements travaux restants</CardTitle>
                <CardDescription>Ajoutez les paiements à effectuer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Mois (YYYY-MM)</Label>
                    <Input
                      type="text"
                      placeholder="2025-06"
                      value={newWorkPayment.month}
                      onChange={(e) => setNewWorkPayment({ ...newWorkPayment, month: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Montant (€)</Label>
                    <Input
                      type="number"
                      value={newWorkPayment.amount}
                      onChange={(e) => setNewWorkPayment({ ...newWorkPayment, amount: Number(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      type="text"
                      value={newWorkPayment.description}
                      onChange={(e) => setNewWorkPayment({ ...newWorkPayment, description: e.target.value })}
                      className="bg-zinc-800 border-zinc-700"
                    />
                  </div>
                </div>
                <Button onClick={handleAddWorkPayment}>Ajouter paiement</Button>
                
                <div className="space-y-2 mt-4">
                  {workPayments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <span className="font-medium">{payment.month}</span>
                        <span className="ml-2 text-gray-400">{payment.description}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-white">{payment.amount.toLocaleString()}€</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeWorkPayment(payment.id)}
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
                <div className="grid grid-cols-4 gap-4">
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
                  <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                      <CardDescription>Épargne mensuelle requise</CardDescription>
                      <CardTitle className="text-2xl">{projection.requiredMonthlySavings.toLocaleString()}€</CardTitle>
                    </CardHeader>
                  </Card>
                </div>

                <Card className="bg-zinc-900 border-zinc-800">
                  <CardHeader>
                    <CardTitle>Projection de l'épargne</CardTitle>
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
