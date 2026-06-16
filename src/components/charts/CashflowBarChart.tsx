'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectionMonth } from '@/types';

interface CashflowBarChartProps {
  data: ProjectionMonth[];
}

export function CashflowBarChart({ data }: CashflowBarChartProps) {
  const chartData = data.map(month => ({
    month: new Date(month.month).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    revenusBase: month.baseIncome,
    revenusAdditionnels: month.additionalIncome,
    coûts: month.additionalCosts,
    contribution: month.monthlyContribution
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis 
          dataKey="month" 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888"
          style={{ fontSize: '12px' }}
          tickFormatter={(value: number) => `${value.toLocaleString()}€`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          labelStyle={{ color: '#888' }}
          formatter={(value: any) => typeof value === 'number' ? `${value.toLocaleString()}€` : '0€'}
        />
        <Legend />
        <Bar 
          dataKey="revenusBase" 
          fill="#3b82f6" 
          name="Revenus base"
          animationDuration={800}
        />
        <Bar 
          dataKey="revenusAdditionnels" 
          fill="#60a5fa" 
          name="Revenus additionnels"
          animationDuration={800}
        />
        <Bar 
          dataKey="coûts" 
          fill="#ef4444" 
          name="Coûts"
          animationDuration={800}
        />
        <Bar 
          dataKey="contribution" 
          fill="#10b981" 
          name="Contribution nette"
          animationDuration={800}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
