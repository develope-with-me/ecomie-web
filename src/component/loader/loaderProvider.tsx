import React, {createContext, PropsWithChildren, useContext, useState} from 'react';
import './loaderProvider.scss';

type LoaderContextType = {
    loading: boolean;
    setLoading: (value: boolean) => void;
}
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const useLoader = () => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error("useLoader must be used as useLoader");
    }
    return context;
}

const LoaderProvider: React.FC<PropsWithChildren> = ({children}) => {
    const [loading, setLoading] = useState(false);

    return (
        <LoaderContext.Provider value={{loading, setLoading}}> {children}
            {loading && <div className="flex justify-center items-center h-screen fixed inset-0 z-50 bg-black bg-opacity-80">
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <div
                            className="animate-spin rounded-full h-32 w-32 border-t-2 border-[#0F337F] border-opacity-50"></div>
                        <div
                            className="animate-spin rounded-full h-24 w-24 border-t-2 border-[#9BAF31] border-opacity-50 absolute"></div>
                        <div
                            className="animate-spin rounded-full h-16 w-16 border-t-2 border-[#772403] border-opacity-50 absolute"></div>
                    </div>
                </div>
            </div>}
        </LoaderContext.Provider>
    )
}

export default LoaderProvider;

