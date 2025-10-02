
import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NuclearStabilityChartProps {
  data: { x: number; y: number; z: number }[];
}

export const NuclearStabilityChart: React.FC<NuclearStabilityChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid stroke="#4a5568" />
        <XAxis type="number" dataKey="x" name="protons" unit="" tick={{ fill: '#a0aec0' }} />
        <YAxis type="number" dataKey="y" name="neutrons" unit="" tick={{ fill: '#a0aec0' }} />
        <ZAxis type="number" dataKey="z" range={[60, 400]} name="binding energy" unit="" />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#4f46e5',
            borderRadius: '0.5rem',
            color: '#e2e8f0',
          }}
        />
        <Scatter name="Stable Nuclei" data={data} fill="#818cf8" shape="circle" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};
