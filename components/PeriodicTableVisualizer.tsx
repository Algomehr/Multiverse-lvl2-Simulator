import React from 'react';
import { ChemicalElement } from '../types';
import { useI18n } from '../i18n';

interface PeriodicTableVisualizerProps {
  elements: ChemicalElement[];
}

export const PeriodicTableVisualizer: React.FC<PeriodicTableVisualizerProps> = ({ elements }) => {
  const { t } = useI18n();

  return (
    <div className="bg-slate-800/50 p-4 rounded-lg">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(80px,1fr))] gap-2">
        {elements.map(el => (
          <div
            key={el.atomicNumber}
            className={`p-2 rounded-md flex flex-col items-center justify-center aspect-square transition-colors duration-300 ${
              el.isStable ? 'bg-indigo-800/70 border-indigo-600' : 'bg-red-800/70 border-red-600'
            } border-2`}
            title={`${el.name}: ${el.description}`}
          >
            <div className="text-xs text-slate-400">{el.atomicNumber}</div>
            <div className="text-2xl font-bold">{el.symbol}</div>
            <div className="text-xs text-center truncate w-full">{el.name}</div>
            <div className="text-xs text-slate-400">{el.atomicMass.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
              <span>{t('chemicalEvolution.stable')}</span>
          </div>
          <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-600"></div>
              <span>{t('chemicalEvolution.unstable')}</span>
          </div>
      </div>
    </div>
  );
};