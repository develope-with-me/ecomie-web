import React from 'react';

const Loader: React.FC = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="space-y-4">
                <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500 border-opacity-50"></div>
                    <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-green-500 border-opacity-50 absolute"></div>
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-yellow-500 border-opacity-50 absolute"></div>
                </div>
            </div>
        </div>
    )
}

export default Loader;

