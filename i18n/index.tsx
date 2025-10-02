import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { en } from './locales/en';
import { fa } from './locales/fa';

type Language = 'en' | 'fa';

const translations = { en, fa };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  t_array: (key: string) => string[];
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Utility to get a nested property from an object using a dot-separated string
const getNested = (obj: any, path: string): string | string[] => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string): string => {
    const translation = getNested(translations[language], key);
    if (typeof translation === 'string') {
        return translation;
    }
    return key; // Fallback to key if not found or not a string
  }, [language]);

  const t_array = useCallback((key: string): string[] => {
    const translation = getNested(translations[language], key);
    if (Array.isArray(translation)) {
        return translation;
    }
    return [key];
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t, t_array }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
