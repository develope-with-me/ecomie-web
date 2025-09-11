import { createRoot } from 'react-dom/client'
import App from '@/App'
import './index.css'

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import './translate/i18n'
import {TranslationProvider} from "@/translate/translation-provider";
import LoaderProvider from "@/components/loader/loaderProvider";
import React from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <TranslationProvider>
            <LoaderProvider>
                <App/>
            </LoaderProvider>
        </TranslationProvider>
    </React.StrictMode>
);
