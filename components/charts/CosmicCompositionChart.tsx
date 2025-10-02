
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CosmicCompositionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#4f46e5', '#818cf8', '#c7d2fe'];

export const CosmicCompositionChart: React.FC<CosmicCompositionChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#4f46e5',
            borderRadius: '0.5rem',
            color: '#e2e8f0',
          }}
          formatter={(value: number) => `${value.toFixed(2)}%`}
        />
        <Legend wrapperStyle={{ color: '#a0aec0', fontSize: '14px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};
