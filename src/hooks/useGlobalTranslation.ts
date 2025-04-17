import { useTranslation } from 'react-i18next';

export const useGlobalTranslation = () => {
  const { t, i18n } = useTranslation();
  
  // Add any custom logic here if needed
  // For example:
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('preferredLanguage', lng);
  };

  return { 
    t, 
    changeLanguage,
    currentLanguage: i18n.language 
  };
};