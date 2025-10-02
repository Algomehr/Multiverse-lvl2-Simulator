import React, { useState } from 'react';
import { PhysicalConstants, SimulationMode } from '../types';
import { PhysicsSlider } from './PhysicsSlider';
import { SparklesIcon, BeakerIcon } from './icons';
import { getConstantsFromGoal } from '../services/geminiService';
import { useI18n } from '../i18n';

interface ControlPanelProps {
  constants: PhysicalConstants;
  setConstants: React.Dispatch<React.SetStateAction<PhysicalConstants>>;
  mode: SimulationMode;
  setMode: React.Dispatch<React.SetStateAction<SimulationMode>>;
  onSimulate: () => void;
  isLoading: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ constants, setConstants, mode, setMode, onSimulate, isLoading }) => {
  const [goal, setGoal] = useState('');
  const [isDesigning, setIsDesigning] = useState(false);
  const [error, setError] = useState('');
  const { t, language } = useI18n();

  const handleSliderChange = (id: string, value: number) => {
    setConstants(prev => ({
      ...prev,
      [id]: { ...prev[id], value },
    }));
  };

  const handleGoalDesign = async () => {
    if (!goal) {
      setError('Please describe the universe you want to design.');
      return;
    }
    setIsDesigning(true);
    setError('');
    try {
      const newConstantValues = await getConstantsFromGoal(goal, language);
      const updatedConstants = { ...constants };
      for (const key in newConstantValues) {
        if (updatedConstants[key]) {
          // Clamp values within min/max
          const { min, max } = updatedConstants[key];
          updatedConstants[key].value = Math.max(min, Math.min(max, newConstantValues[key]));
        }
      }
      setConstants(updatedConstants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsDesigning(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-slate-900/70 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-indigo-900/20">
      <div className="mb-6 flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={() => setMode(SimulationMode.Narrative)}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${mode === SimulationMode.Narrative ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/50' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          <SparklesIcon /> {t('narrativeMode')}
        </button>
        <button
          onClick={() => setMode(SimulationMode.Researcher)}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${mode === SimulationMode.Researcher ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' : 'bg-slate-700 hover:bg-slate-600'}`}
        >
          <BeakerIcon /> {t('researcherMode')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* FIX: Changed from Object.values to Object.keys to prevent a type inference issue where the mapped item was incorrectly typed as 'unknown'. */}
        {Object.keys(constants).map(key => (
          <PhysicsSlider key={key} constant={constants[key]} name={t(`constants.${key}`)} onChange={handleSliderChange} />
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center text-indigo-300">{t('goalDesignerTitle')}</h3>
        <textarea
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder={t('goalDesignerPlaceholder')}
          className="w-full p-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
          rows={2}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-center gap-4">
            <button
            onClick={handleGoalDesign}
            disabled={isDesigning || isLoading}
            className="w-1/2 flex items-center justify-center gap-2 px-6 py-3 font-semibold bg-green-600 hover:bg-green-500 rounded-lg disabled:bg-green-800 disabled:cursor-not-allowed transition"
            >
            {isDesigning ? t('designing') : t('designConstants')}
            </button>
            <button
                onClick={onSimulate}
                disabled={isLoading}
                className="w-1/2 text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white py-3 px-6 rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-wait transition transform hover:scale-105"
            >
                {isLoading ? t('simulating') : t('createUniverse')}
            </button>
        </div>
      </div>
    </div>
  );
};
