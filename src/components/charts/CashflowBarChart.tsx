'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectionMonth } from '@/types';

interface CashflowBarChartProps {
  data: ProjectionMonth[];
  view?: 'week' | 'month';
}

export function CashflowBarChart({ data, view = 'week' }: CashflowBarChartProps) {
  // Aggregate by month if requested
  let chartData: any[];
  if (view === 'month') {
    const byMonth: Record<string, { monthLabel: string; revenusBase: number; revenusAdditionnels: number; coûts: number; contribution: number }> = {};
    data.forEach(d => {
      const key = d.month; // YYYY-MM
      if (!byMonth[key]) {
        byMonth[key] = { monthLabel: new Date(key + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }), revenusBase: 0, revenusAdditionnels: 0, coûts: 0, contribution: 0 };
      }
      byMonth[key].revenusBase += d.baseIncome;
      byMonth[key].revenusAdditionnels += d.additionalIncome;
      byMonth[key].coûts += d.additionalCosts;
      byMonth[key].contribution += d.weeklyContribution;
    });
    chartData = Object.keys(byMonth).map(k => ({ month: byMonth[k].monthLabel, ...byMonth[k] }));
  } else {
    chartData = data.map(month => ({
      month: month.period,
      revenusBase: month.baseIncome,
      revenusAdditionnels: month.additionalIncome,
      coûts: month.additionalCosts,
      contribution: month.weeklyContribution
    }));
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(112, 91, 70, 0.18)" />
        <XAxis 
          dataKey="month" 
          stroke="#8b7a64"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#8b7a64"
          style={{ fontSize: '12px' }}
          tickFormatter={(value: number) => `${value.toLocaleString()}€`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff8ea', border: '1px solid rgba(112, 91, 70, 0.18)', borderRadius: '8px' }}
          itemStyle={{ color: '#2c2924' }}
          labelStyle={{ color: '#8b7a64' }}
          formatter={(value: any) => typeof value === 'number' ? `${value.toLocaleString()}€` : '0€'}
        />
        <Legend />
        <Bar 
          dataKey="revenusBase" 
          fill="#526a68" 
          name="Revenus base"
          animationDuration={800}
        />
        <Bar 
          dataKey="revenusAdditionnels" 
          fill="#dce8e5" 
          name="Revenus additionnels"
          animationDuration={800}
        />
        <Bar 
          dataKey="coûts" 
          fill="#c2915d" 
          name="Coûts"
          animationDuration={800}
        />
        <Bar 
          dataKey="contribution" 
          fill="#8b7a64" 
          name="Contribution nette"
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
