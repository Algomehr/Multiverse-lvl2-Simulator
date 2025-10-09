import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { PhysicalConstants, QuantumFluctuationsData } from '../types';
import { simulateQuantumFluctuations } from '../services/geminiService';
import { useI18n } from '../i18n';
import { QuantumFluctuationsVisualizer } from './QuantumFluctuationsVisualizer';

interface QuantumFluctuationsSimulatorProps {
  constants: PhysicalConstants;
}

export const QuantumFluctuationsSimulator: React.FC<QuantumFluctuationsSimulatorProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fluctuationsData, setFluctuationsData] = useState<QuantumFluctuationsData | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFluctuationsData(null);

    try {
      const data = await simulateQuantumFluctuations(constants, language);
      setFluctuationsData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-[1px] bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-2xl h-full lg:col-span-2">
        <div className="bg-slate-900/80 backdrop-blur-sm rounded-[15px] p-6 md:p-8 h-full flex flex-col">
          <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t('quantumFluctuations.title')}
          </h2>
    
          <form onSubmit={handleSimulate} className="text-center mb-6">
             <p className="text-slate-300 mb-4">{t('quantumFluctuations.promptText')}</p>
             <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
            >
              {isLoading ? t('quantumFluctuations.simulatingButtonText') : t('quantumFluctuations.buttonText')}
            </button>
          </form>

          <div className="flex-grow">
            {isLoading && (
                <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                    <p className="mt-4 text-slate-300">{t('quantumFluctuations.loadingText')}</p>
                </div>
            )}
    
            {error && !isLoading && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
                <h4 className="font-bold text-red-300">{t('quantumFluctuations.errorTitle')}</h4>
                <p className="text-red-400 text-sm mt-1">{error}</p>
                </div>
            )}

            {fluctuationsData && !isLoading && (
                <div className="space-y-6">
                    <QuantumFluctuationsVisualizer 
                        energyLevel={fluctuationsData.energyLevel} 
                        fluctuationScale={fluctuationsData.fluctuationScale} 
                    />
                    <div>
                        <h4 className="text-xl font-bold text-indigo-300 mb-2">{t('quantumFluctuations.reportTitle')}</h4>
                        <div className="text-slate-300 bg-slate-800/50 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
                           <ReactMarkdown
                             className="prose prose-sm prose-invert prose-p:my-2"
                             remarkPlugins={[remarkMath, remarkGfm]}
                             rehypePlugins={[rehypeKatex]}
                           >
                             {fluctuationsData.report}
                           </ReactMarkdown>
                        </div>
                    </div>
                </div>
            )}
          </div>
        </div>
    </div>
  );
};