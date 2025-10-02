import React from 'react';
import { useI18n } from '../i18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-slate-800/70 text-indigo-300 hover:text-white hover:bg-slate-700 font-semibold py-2 px-4 border border-slate-700 rounded-lg shadow-md transition-all duration-200"
      aria-label="Toggle language"
    >
      {language === 'en' ? t('lang.toggleToFarsi') : t('lang.toggleToEnglish')}
    </button>
  );
};
