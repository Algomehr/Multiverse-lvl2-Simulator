import React, { useState } from 'react';
import { PhysicalConstants, DynamicTimelineData } from '../types';
import { simulateDynamicTimeline } from '../services/geminiService';
import { useI18n } from '../i18n';
import { TimelineVisualizer } from './TimelineVisualizer';

interface DynamicTimelineSimulatorProps {
  constants: PhysicalConstants;
}

export const DynamicTimelineSimulator: React.FC<DynamicTimelineSimulatorProps> = ({ constants }) => {
  const { t, language } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timelineData, setTimelineData] = useState<DynamicTimelineData | null>(null);

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setTimelineData(null);

    try {
      const data = await simulateDynamicTimeline(constants, language);
      setTimelineData(data);
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
        {t('dynamicTimeline.title')}
      </h2>

      <form onSubmit={handleSimulate} className="text-center mb-6">
         <p className="text-slate-300 mb-4">{t('dynamicTimeline.promptText')}</p>
         <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2.5 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
        >
          {isLoading ? t('dynamicTimeline.simulatingButtonText') : t('dynamicTimeline.buttonText')}
        </button>
      </form>

      <div className="flex-grow">
        {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
                <p className="mt-4 text-slate-300">{t('dynamicTimeline.loadingText')}</p>
            </div>
        )}

        {error && !isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-3 bg-red-900/50 border border-red-500 rounded-lg">
            <h4 className="font-bold text-red-300">{t('dynamicTimeline.errorTitle')}</h4>
            <p className="text-red-400 text-sm mt-1">{error}</p>
            </div>
        )}

        {timelineData && !isLoading && (
            <div className="space-y-6">
                <div>
                    <h4 className="text-xl font-bold text-indigo-300 mb-2">{t('dynamicTimeline.summary')}</h4>
                    <p className="text-slate-300 bg-slate-800/50 p-4 rounded-lg text-sm">{timelineData.summary}</p>
                </div>
                <TimelineVisualizer epochs={timelineData.epochs} />
            </div>
        )}
      </div>
      </div>
    </div>
  );
};