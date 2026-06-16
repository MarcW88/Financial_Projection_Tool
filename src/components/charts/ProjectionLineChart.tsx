'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ProjectionMonth } from '@/types';

interface ProjectionLineChartProps {
  data: ProjectionMonth[];
  targetAmount: number;
}

export function ProjectionLineChart({ data, targetAmount }: ProjectionLineChartProps) {
  const chartData = data.map(month => ({
    month: month.period,
    fondsRéel: month.kitchenFundEnd,
    trajectoireCible: month.targetTrackFund,
    objectif: targetAmount,
    trajectoireProj: month.projectedTrajectory
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
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
        <Line 
          type="monotone" 
          dataKey="fondsRéel" 
          stroke="#526a68" 
          strokeWidth={3}
          dot={{ fill: '#526a68', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="trajectoireCible" 
          stroke="#c2915d" 
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={false}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="trajectoireProj" 
          stroke="#4a90e2" 
          strokeWidth={2}
          strokeDasharray="3 3"
          dot={false}
          animationDuration={1000}
        />
        <Line 
          type="monotone" 
          dataKey="objectif" 
          stroke="#8b7a64" 
          strokeWidth={2}
          strokeDasharray="10 5"
          dot={false}
          animationDuration={1000}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
