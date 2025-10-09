import React, { useState } from 'react';
import { PhysicalConstants, StellarEvolutionData } from '../types';
import { simulateStellarEvolution } from '../services/geminiService';
import { useI18n } from '../i18n';
import { StellarEvolutionVisualizer } from './StellarEvolutionVisualizer';

interface StellarEvolutionSimulatorProps {
  constants: PhysicalConstants;
}

export const StellarEvolutionSimulator: React.FC<StellarEvolutionSimulatorProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [mass, setMass] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evolutionData, setEvolutionData] = useState<StellarEvolutionData | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericMass = parseFloat(mass);
    if (isNaN(numericMass) || numericMass <= 0) {
      setError('Please enter a valid, positive stellar mass.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvolutionData(null);

    try {
      const data = await simulateStellarEvolution(constants, numericMass, language);
      setEvolutionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[1px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl h-full">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-[15px] p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {t('stellarEvolution.title')}
      </h2>
      <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <label htmlFor="stellar-mass" className="text-lg font-medium text-indigo-300">
          {t('stellarEvolution.massLabel')}:
        </label>
        <input
          id="stellar-mass"
          type="number"
          value={mass}
          onChange={(e) => setMass(e.target.value)}
          placeholder={t('stellarEvolution.massPlaceholder')}
          step="0.1"
          min="0.1"
          className="w-full sm:w-40 p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
        >
          {isLoading ? t('stellarEvolution.simulatingButtonText') : t('stellarEvolution.buttonText')}
        </button>
      </form>

      {error && (
        <div className="mt-4 text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <h4 className="font-bold text-red-300">{t('stellarEvolution.errorTitle')}</h4>
          <p className="text-red-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {evolutionData && (
        <div className="mt-6 space-y-6">
          <StellarEvolutionVisualizer data={evolutionData} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
             <div className="bg-slate-800/50 p-3 rounded-lg">
                <p className="text-sm text-indigo-300">{t('stellarEvolution.initialMass')}</p> 
                <p className="text-lg font-bold">{evolutionData.initialMass} Solar Masses</p>
             </div>
             <div className="bg-slate-800/50 p-3 rounded-lg">
                <p className="text-sm text-indigo-300">{t('stellarEvolution.finalFate')}</p> 
                <p className="text-lg font-bold">{evolutionData.finalFate}</p>
            </div>
          </div>
          <div className="space-y-4">
            {evolutionData.stages.map((stage, index) => (
              <div key={index} className="p-4 bg-slate-800/50 border-l-4 rounded-r-lg" style={{borderColor: stage.color}}>
                <h4 className="text-xl font-bold" style={{color: stage.color}}>{index + 1}. {stage.name}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
                    <span><strong>{t('stellarEvolution.duration')}:</strong> {stage.duration}</span>
                    <span><strong>{t('stellarEvolution.temperature')}:</strong> {stage.temperature}</span>
                </div>
                <p className="mt-2 text-slate-300">{stage.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};