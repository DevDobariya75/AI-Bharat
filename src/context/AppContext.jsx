import { createContext, useContext, useMemo, useState } from 'react';
import { translations } from '../i18n/translations';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [prediction, setPrediction] = useState(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'hi' : 'en'));
  };

  const value = useMemo(
    () => ({
      language,
      text: translations[language],
      prediction,
      setPrediction,
      toggleLanguage
    }),
    [language, prediction]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}