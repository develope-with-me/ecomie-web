import {createContext, useContext} from "react";
import {useTranslation} from "react-i18next";
import React from 'react';

interface TranslationContextType {
    t: (key: string) => string;
    i18n: any; // You can replace `any` with specific types if needed
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const {t, i18n} = useTranslation();
    return (
        <TranslationContext.Provider value={{t, i18n}}>{children}</TranslationContext.Provider>
    );
};

export const useGlobalTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useGlobalTranslation must be used within a TranslationProvider');
    }
    return context;
}