import React, { useState } from 'react';
import { PhysicalConstants, StellarEvolutionData3D } from '../types';
import { simulateStellarEvolution3D } from '../services/geminiService';
import { useI18n } from '../i18n';
import { StellarEvolutionVisualizer3D } from './StellarEvolutionVisualizer3D';

interface StellarEvolutionSimulator3DProps {
  constants: PhysicalConstants;
}

export const StellarEvolutionSimulator3D: React.FC<StellarEvolutionSimulator3DProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [mass, setMass] = useState('1.0');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evolutionData, setEvolutionData] = useState<StellarEvolutionData3D | null>(null);

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
      const data = await simulateStellarEvolution3D(constants, numericMass, language);
      setEvolutionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[1px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl lg:col-span-2 h-full">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-[15px] p-6 md:p-8 h-full flex flex-col">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {t('stellarEvolution3D.title')}
      </h2>
      
       <div className="text-center mb-6">
         <p className="text-slate-300 mb-4">{t('stellarEvolution3D.promptText')}</p>
        <form onSubmit={handleSimulate} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <label htmlFor="stellar-mass-3d" className="text-lg font-medium text-indigo-300">
            {t('stellarEvolution3D.massLabel')}:
            </label>
            <input
            id="stellar-mass-3d"
            type="number"
            value={mass}
            onChange={(e) => setMass(e.target.value)}
            placeholder="e.g., 1.0"
            step="0.1"
            min="0.1"
            className="w-full sm:w-40 p-2 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
            <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
            >
            {isLoading ? t('stellarEvolution3D.simulatingButtonText') : t('stellarEvolution3D.buttonText')}
            </button>
        </form>
      </div>


      {isLoading && (
        <div className="flex-grow flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
            <p className="mt-4 text-slate-300">Simulating stellar lifecycle...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
          <h4 className="font-bold text-red-300">{t('stellarEvolution3D.errorTitle')}</h4>
          <p className="text-red-400 text-sm mt-1">{error}</p>
        </div>
      )}

      {evolutionData && !isLoading && (
        <StellarEvolutionVisualizer3D data={evolutionData} />
      )}
      </div>
    </div>
  );
};