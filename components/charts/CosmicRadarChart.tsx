
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CosmicRadarChartProps {
  data: { subject: string; value: number }[];
}

export const CosmicRadarChart: React.FC<CosmicRadarChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#4a5568" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0aec0', fontSize: 12 }} />
        <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: 'transparent' }} />
        <Radar name="Universe Specs" dataKey="value" stroke="#818cf8" fill="#4f46e5" fillOpacity={0.6} />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            borderColor: '#4f46e5',
            borderRadius: '0.5rem',
            color: '#e2e8f0',
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
