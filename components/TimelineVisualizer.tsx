import React, { useState } from 'react';
import { TimelineEpoch } from '../types';
import { useI18n } from '../i18n';

interface TimelineVisualizerProps {
  epochs: TimelineEpoch[];
}

const DetailItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-semibold text-indigo-300">{label}</p>
        <p className="text-slate-200">{value}</p>
    </div>
);

export const TimelineVisualizer: React.FC<TimelineVisualizerProps> = ({ epochs }) => {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!epochs || epochs.length === 0) {
    return null;
  }

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentIndex(parseInt(event.target.value, 10));
  };
  
  const currentEpoch = epochs[currentIndex];

  const sliderProgress = (currentIndex / (epochs.length - 1)) * 100;

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg space-y-4">
      <div>
        <input
          type="range"
          min="0"
          max={epochs.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg accent-indigo-500"
          style={{
            background: `linear-gradient(to right, #6366f1 ${sliderProgress}%, #374151 ${sliderProgress}%)`
          }}
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1 px-1">
           <span>{epochs[0].name}</span>
           <span>{epochs[epochs.length - 1].name}</span>
        </div>
      </div>
      
      <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
        <h3 className="text-xl font-bold text-purple-400 mb-2">{currentEpoch.name}</h3>
        <p className="text-slate-300 mb-4">{currentEpoch.description}</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
            <DetailItem label={t('dynamicTimeline.timeRange')} value={currentEpoch.timeRange} />
            <DetailItem label={t('dynamicTimeline.temperature')} value={currentEpoch.temperature} />
            <DetailItem label={t('dynamicTimeline.universeSize')} value={currentEpoch.universeSize} />
            <DetailItem label={t('dynamicTimeline.dominantProcess')} value={currentEpoch.dominantProcess} />
        </div>
      </div>
    </div>
  );
};
