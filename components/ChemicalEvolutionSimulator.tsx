import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { PhysicalConstants, ChemicalEvolutionData } from '../types';
import { simulateChemicalEvolution } from '../services/geminiService';
import { useI18n } from '../i18n';
import { PeriodicTableVisualizer } from './PeriodicTableVisualizer';

interface ChemicalEvolutionSimulatorProps {
  constants: PhysicalConstants;
}

export const ChemicalEvolutionSimulator: React.FC<ChemicalEvolutionSimulatorProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evolutionData, setEvolutionData] = useState<ChemicalEvolutionData | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEvolutionData(null);

    try {
      const data = await simulateChemicalEvolution(constants, language);
      setEvolutionData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 flex flex-col h-full">
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        {t('chemicalEvolution.title')}
      </h2>

      <form onSubmit={handleSimulate} className="text-center mb-6">
         <p className="text-slate-300 mb-4">{t('chemicalEvolution.promptText')}</p>
         <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
        >
          {isLoading ? t('chemicalEvolution.simulatingButtonText') : t('chemicalEvolution.buttonText')}
        </button>
      </form>

      <div className="flex-grow">
        {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                <p className="mt-4 text-slate-300">{t('chemicalEvolution.loadingText')}</p>
            </div>
        )}

        {error && !isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <h4 className="font-bold text-red-300">{t('chemicalEvolution.errorTitle')}</h4>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
        )}

        {evolutionData && !isLoading && (
            <div className="space-y-6">
                <div>
                    <h4 className="text-xl font-bold text-indigo-300 mb-2">{t('chemicalEvolution.reportTitle')}</h4>
                    <div className="text-slate-300 bg-slate-800/50 p-4 rounded-lg text-sm">
                       <ReactMarkdown
                         className="prose prose-sm prose-invert prose-p:my-2"
                         remarkPlugins={[remarkMath, remarkGfm]}
                         rehypePlugins={[rehypeKatex]}
                       >
                         {evolutionData.report}
                       </ReactMarkdown>
                    </div>
                </div>
                 <div>
                    <h4 className="text-xl font-bold text-indigo-300 mb-2">{t('chemicalEvolution.periodicTableTitle')}</h4>
                    <PeriodicTableVisualizer elements={evolutionData.elements} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};