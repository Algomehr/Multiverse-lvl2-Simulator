import React from 'react';
import { useI18n } from '../i18n';
import { GlobeIcon } from './icons';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 bg-slate-800/70 text-indigo-300 hover:text-white hover:bg-slate-700 rounded-full shadow-md transition-all duration-200"
      aria-label="Toggle language"
    >
      <GlobeIcon className="w-6 h-6" />
    </button>
  );
};