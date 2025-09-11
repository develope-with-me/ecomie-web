import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './translate/i18n'
import {TranslationProvider} from "./translate/translation-provider";
import LoaderProvider from "@/components/loader/loaderProvider";

const rootElement = window.document.getElementById('root');

if (rootElement) {
    const root = ReactDOM.createRoot(rootElement); // Create the root
    root.render(
        <React.StrictMode>
            <TranslationProvider>
                <LoaderProvider>
                    <App/>
                </LoaderProvider>
            </TranslationProvider>
        </React.StrictMode>
    );
} else {
    console.error("Root element not found");
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
