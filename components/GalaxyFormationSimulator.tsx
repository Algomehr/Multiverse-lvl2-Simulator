import React, { useState } from 'react';
import { PhysicalConstants, GalaxyFormationData } from '../types';
import { simulateGalaxyFormation } from '../services/geminiService';
import { useI18n } from '../i18n';
import { GalaxyFormationVisualizer } from './GalaxyFormationVisualizer';

interface GalaxyFormationSimulatorProps {
  constants: PhysicalConstants;
}

const DetailChip: React.FC<{ label: string, value: string }> = ({ label, value }) => (
    <div className="bg-slate-800/50 p-3 rounded-lg text-center">
        <p className="text-sm text-indigo-300">{label}</p>
        <p className="text-md font-bold">{value}</p>
    </div>
);

export const GalaxyFormationSimulator: React.FC<GalaxyFormationSimulatorProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [galaxyData, setGalaxyData] = useState<GalaxyFormationData | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGalaxyData(null); // Clear previous results

    try {
      const data = await simulateGalaxyFormation(constants, language);
      setGalaxyData(data);
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
        {t('galaxyFormation.title')}
      </h2>

      <form onSubmit={handleSimulate} className="text-center mb-6">
         <p className="text-slate-300 mb-4">{t('galaxyFormation.promptText')}</p>
         <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
        >
          {isLoading ? t('galaxyFormation.simulatingButtonText') : t('galaxyFormation.buttonText')}
        </button>
      </form>

      <div className="flex-grow">
        {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                <p className="mt-4 text-slate-300">{t('galaxyFormation.loadingText')}</p>
            </div>
        )}

        {error && !isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <h4 className="font-bold text-red-300">{t('galaxyFormation.errorTitle')}</h4>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
        )}

        {galaxyData && !isLoading && (
            <div className="space-y-6">
            <GalaxyFormationVisualizer params={galaxyData.visualizationParameters} galaxyType={galaxyData.galaxyType}/>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DetailChip label={t('galaxyFormation.galaxyType')} value={galaxyData.galaxyType} />
                <DetailChip label={t('galaxyFormation.size')} value={galaxyData.size} />
                <DetailChip label={t('galaxyFormation.starFormationRate')} value={galaxyData.starFormationRate} />
            </div>
            <div>
                <h4 className="text-xl font-bold text-indigo-300 mb-2">{t('galaxyFormation.description')}</h4>
                <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg">{galaxyData.description}</p>
            </div>
            </div>
        )}
      </div>
      </div>
    </div>
  );
};