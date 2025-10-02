
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ExpansionHistoryChartProps {
  data: { time: string; value: number }[];
}

export const ExpansionHistoryChart: React.FC<ExpansionHistoryChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
        <XAxis dataKey="time" tick={{ fill: '#a0aec0' }} />
        <YAxis tick={{ fill: '#a0aec0' }} label={{ value: 'Relative Size', angle: -90, position: 'insideLeft', fill: '#a0aec0' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#4f46e5',
            borderRadius: '0.5rem',
            color: '#e2e8f0',
          }}
        />
        <Line type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={2} activeDot={{ r: 8 }} dot={{ fill: '#4f46e5' }} />
      </LineChart>
    </ResponsiveContainer>
  );
};
