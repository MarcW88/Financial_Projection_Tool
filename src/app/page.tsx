'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjection } from '@/hooks/useProjection';
import { ProjectionLineChart } from '@/components/charts/ProjectionLineChart';
import { CashflowBarChart } from '@/components/charts/CashflowBarChart';
import { validateMonthlyAdjustment } from '@/lib/validators';

type Section = 'projection' | 'donnees' | 'scenarios';

export default function Home() {
  const {
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
    scenarios
  } = useProjection();

  const [activeSection, setActiveSection] = useState<Section>('projection');
  const [newAdjustment, setNewAdjustment] = useState({
    month: '',
    additionalIncome: 0,
    additionalCosts: 0,
    note: ''
  });
  const [adjustmentErrors, setAdjustmentErrors] = useState<string[]>([]);

  const handleAddAdjustment = () => {
    const adjustment = {
      id: Date.now().toString(),
      month: newAdjustment.month,
      additionalIncome: newAdjustment.additionalIncome,
      additionalCosts: newAdjustment.additionalCosts,
      note: newAdjustment.note
    };

    const validation = validateMonthlyAdjustment(adjustment, config.targetDate);
    if (!validation.valid) {
      setAdjustmentErrors(validation.errors);
      return;
    }

    setAdjustmentErrors([]);
    addMonthlyAdjustment(adjustment);
    setNewAdjustment({ month: '', additionalIncome: 0, additionalCosts: 0, note: '' });
  };

  const currentProjection = selectedScenario === 'realiste'
    ? projection
    : scenarioResults[selectedScenario];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-[2rem] border border-sidebar-border bg-sidebar p-6 shadow-sm">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sidebar-primary">Outil de projection</p>
              <h1 className="mt-3 text-3xl font-bold text-sidebar-foreground">Financial Projection Tool</h1>
              <p className="mt-3 text-sm leading-6 text-sidebar-foreground/80">Comprendre votre projet et vos scénarios en quelques clics.</p>
            </div>

            <div className="space-y-2">
              <Button
                variant={activeSection === 'projection' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('projection')}
              >
                Projection
              </Button>
              <Button
                variant={activeSection === 'donnees' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('donnees')}
              >
                Données
              </Button>
              <Button
                variant={activeSection === 'scenarios' ? 'default' : 'outline'}
                className="w-full justify-start"
                onClick={() => setActiveSection('scenarios')}
              >
                Scénarios
              </Button>
            </div>

            <div className="rounded-3xl border border-sidebar-border bg-card p-4">
              <p className="text-sm font-semibold text-sidebar-primary">Pour les néophytes</p>
              <p className="mt-2 text-sm leading-6 text-sidebar-foreground/80">Renseignez simplement vos revenus et coûts. Le résultat s’actualise automatiquement.</p>
            </div>
          </aside>

          <main className="space-y-6">
            {errors.length > 0 && (
              <div className="rounded-3xl border border-destructive bg-destructive/10 p-4 text-sm text-destructive-foreground">
                {errors.map((error, i) => (
                  <p key={i}>{error}</p>
                ))}
              </div>
            )}

            {warnings.length > 0 && (
              <div className="rounded-3xl border border-accent bg-accent p-4 text-sm text-accent-foreground">
                {warnings.map((warning, i) => (
                  <p key={i}>{warning}</p>
                ))}
              </div>
            )}

            {activeSection === 'projection' && (
              <section className="space-y-6">
                <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
                  <div className="rounded-[2rem] border border-border bg-card p-6">
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Synthèse</p>
                        <h2 className="mt-2 text-2xl font-semibold">Projection de votre épargne</h2>
                      </div>
                      <p className="text-sm leading-6 text-muted-foreground">La projection prend en compte vos revenus, votre épargne actuelle et les ajustements mensuels.</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-3xl border border-border bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Objectif</p>
                          <p className="mt-2 text-2xl font-semibold">{config.targetAmount.toLocaleString()}€</p>
                        </div>
                        <div className="rounded-3xl border border-border bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Projeté</p>
                          <p className="mt-2 text-2xl font-semibold">{projection ? `${projection.finalAmount.toLocaleString()}€` : '---'}</p>
                        </div>
                        <div className="rounded-3xl border border-border bg-muted p-4">
                          <p className="text-sm text-muted-foreground">Écart</p>
                          <p className={`mt-2 text-2xl font-semibold ${projection && projection.finalGap >= 0 ? 'text-destructive' : 'text-foreground'}`}>{projection ? `${projection.finalGap.toLocaleString()}€` : '---'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Détails rapides</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid gap-3">
                          <div className="rounded-3xl border border-border bg-muted p-4">
                            <p className="text-sm text-muted-foreground">Revenu net mensuel</p>
                            <p className="mt-1 text-xl font-semibold">{config.baseNetIncome.toLocaleString()}€</p>
                          </div>
                          <div className="rounded-3xl border border-border bg-muted p-4">
                            <p className="text-sm text-muted-foreground">Épargne actuelle</p>
                            <p className="mt-1 text-xl font-semibold">{config.currentSavings.toLocaleString()}€</p>
                          </div>
                          <div className="rounded-3xl border border-border bg-muted p-4">
                            <p className="text-sm text-muted-foreground">Date cible</p>
                            <p className="mt-1 text-xl font-semibold">{new Date(config.targetDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Ajustements actifs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {monthlyAdjustments.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucun ajustement ajouté.</p>
                        ) : (
                          <div className="space-y-3">
                            {monthlyAdjustments.map((adjustment) => (
                              <div key={adjustment.id} className="rounded-3xl border border-border bg-muted p-4">
                                <div className="flex justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-medium">{adjustment.month}</p>
                                    <p className="text-sm text-muted-foreground">{adjustment.note || 'Coût ou revenu supplémentaire'}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-green-600">+{adjustment.additionalIncome.toLocaleString()}€</p>
                                    <p className="text-sm text-destructive">-{adjustment.additionalCosts.toLocaleString()}€</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {projection ? (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle>Projection vs trajectoire cible</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProjectionLineChart data={projection.months} targetAmount={config.targetAmount} />
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Flux de trésorerie</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CashflowBarChart data={projection.months} />
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Calculez votre première projection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">Renseignez vos données et appuyez sur recalculer pour visualiser l’impact réel.</p>
                    </CardContent>
                  </Card>
                )}
              </section>
            )}

            {activeSection === 'donnees' && (
              <section className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Paramètres de base</CardTitle>
                      <CardDescription>Revenus, épargne et objectif cible</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <Label>Revenu net mensuel de base (€)</Label>
                          <Input
                            type="number"
                            value={config.baseNetIncome}
                            onChange={(e) => updateConfig({ baseNetIncome: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Épargne actuelle (€)</Label>
                          <Input
                            type="number"
                            value={config.currentSavings}
                            onChange={(e) => updateConfig({ currentSavings: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Objectif cuisine (€)</Label>
                          <Input
                            type="number"
                            value={config.targetAmount}
                            onChange={(e) => updateConfig({ targetAmount: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Date cible</Label>
                          <Input
                            type="date"
                            value={config.targetDate}
                            onChange={(e) => updateConfig({ targetDate: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button onClick={calculateProjection} className="w-full">Recalculer la projection</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Coûts et revenus mensuels</CardTitle>
                      <CardDescription>Ajoutez séparément chaque variation de revenu ou coût.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label>Mois (YYYY-MM)</Label>
                          <Input
                            type="text"
                            placeholder="2025-06"
                            value={newAdjustment.month}
                            onChange={(e) => setNewAdjustment({ ...newAdjustment, month: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Note</Label>
                          <Input
                            type="text"
                            value={newAdjustment.note}
                            onChange={(e) => setNewAdjustment({ ...newAdjustment, note: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Revenus additionnels (€)</Label>
                          <Input
                            type="number"
                            value={newAdjustment.additionalIncome}
                            onChange={(e) => setNewAdjustment({ ...newAdjustment, additionalIncome: Number(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label>Coûts additionnels (€)</Label>
                          <Input
                            type="number"
                            value={newAdjustment.additionalCosts}
                            onChange={(e) => setNewAdjustment({ ...newAdjustment, additionalCosts: Number(e.target.value) })}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddAdjustment} className="w-full">Ajouter ajustement</Button>
                      {adjustmentErrors.length > 0 && (
                        <div className="rounded-3xl border border-destructive bg-destructive/10 p-4 text-sm text-destructive-foreground">
                          {adjustmentErrors.map((error, index) => (
                            <p key={index}>{error}</p>
                          ))}
                        </div>
                      )}
                      <div className="space-y-3">
                        {monthlyAdjustments.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucun coût ou revenu mensuel défini.</p>
                        ) : (
                          monthlyAdjustments.map((adjustment) => (
                            <div key={adjustment.id} className="rounded-3xl border border-border bg-muted p-4">
                              <div className="flex flex-wrap items-center justify-between gap-4">
                                <div>
                                  <p className="font-semibold">{adjustment.month}</p>
                                  <p className="text-sm text-muted-foreground">{adjustment.note || 'Sans description'}</p>
                                </div>
                                <div className="space-y-1 text-right">
                                  <p className="text-sm text-green-600">+{adjustment.additionalIncome.toLocaleString()}€</p>
                                  <p className="text-sm text-destructive">-{adjustment.additionalCosts.toLocaleString()}€</p>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => removeMonthlyAdjustment(adjustment.id)}>Supprimer</Button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {activeSection === 'scenarios' && (
              <section className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scénarios</CardTitle>
                    <CardDescription>Testez plusieurs trajectoires et comparez l’impact.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                      {scenarios.map((scenario) => (
                        <Button
                          key={scenario.name}
                          variant={selectedScenario === scenario.name ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setSelectedScenario(scenario.name)}
                        >
                          {scenario.name}
                        </Button>
                      ))}
                    </div>
                    <div className="rounded-3xl border border-border bg-muted p-4">
                      <p className="text-sm font-medium">{scenarios.find((s) => s.name === selectedScenario)?.description}</p>
                    </div>
                    {currentProjection ? (
                      <div className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Card className="bg-muted">
                            <CardHeader>
                              <CardDescription>Montant final</CardDescription>
                              <CardTitle className="text-xl">{currentProjection.finalAmount.toLocaleString()}€</CardTitle>
                            </CardHeader>
                          </Card>
                          <Card className="bg-muted">
                            <CardHeader>
                              <CardDescription>Écart</CardDescription>
                              <CardTitle className={`text-xl ${currentProjection.finalGap >= 0 ? 'text-destructive' : 'text-green-600'}`}>
                                {currentProjection.finalGap.toLocaleString()}€
                              </CardTitle>
                            </CardHeader>
                          </Card>
                          <Card className="bg-muted">
                            <CardHeader>
                              <CardDescription>Objectif atteint</CardDescription>
                              <CardTitle className={`text-xl ${currentProjection.targetReached ? 'text-green-600' : 'text-red-600'}`}>
                                {currentProjection.targetReached ? 'Oui' : 'Non'}
                              </CardTitle>
                            </CardHeader>
                          </Card>
                        </div>
                        <Card className="bg-muted">
                          <CardHeader>
                            <CardTitle>Projection - Scénario {selectedScenario}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ProjectionLineChart data={currentProjection.months} targetAmount={config.targetAmount} />
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>Scénario non disponible</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Calculez la projection d’abord pour comparer les scénarios.</p>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
