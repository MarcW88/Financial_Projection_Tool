'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectionMonth } from '@/types';

interface ProjectionLineChartProps {
  data: ProjectionMonth[];
  targetAmount: number;
}

export function ProjectionLineChart({ data, targetAmount }: ProjectionLineChartProps) {
  const chartData = data.map(month => ({
    month: new Date(month.month).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' }),
    fondsRéel: month.kitchenFundEnd,
    trajectoireCible: month.targetTrackFund,
    objectif: targetAmount
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
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
        <Line 
          type="monotone" 
          dataKey="fondsRéel" 
          stroke="#3b82f6" 
          strokeWidth={3}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="trajectoireCible" 
          stroke="#f59e0b" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="objectif" 
          stroke="#10b981" 
          strokeWidth={2}
          strokeDasharray="10 5"
          dot={false}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
