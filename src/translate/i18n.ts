import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./en.json";
import frTranslation from "./fr.json";


const resources = {
  en: { translation: enTranslation },
  fr: { translation: frTranslation }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next) 
  .init({
    resources,
    fallbackLng: "en",
    debug: true, 
    interpolation: { escapeValue: false }
  });

export default i18n;
