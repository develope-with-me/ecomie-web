import React from 'react'
import Button from '../component UI/Button';

interface HeadDashboardProps {
    selectButtonProps?: {
        title?: string;
        onClick: () => void;
    };
    addModalButtonProps?: {
        title?: string;
        onClick: () => void;
    };
};
const HeadDashboard: React.FC<HeadDashboardProps> = ({selectButtonProps, addModalButtonProps}) => {


    return (
        <div>
            <div className='flex justify-between '>
                <div className='flex md:gap-[30px] gap-[15px]'>
                    <input type="text" className='md:w-64 w-40 h-9  border-2 rounded border-gray-500 '/>
                    <Button title={selectButtonProps?.title || ''} onClick={selectButtonProps?.onClick}/>
                </div>
                <Button title={addModalButtonProps?.title || ''}
                        icon={'fa-solid fa-plus pr-3'}
                        onClick={addModalButtonProps?.onClick}/>
            </div>
        </div>
    )
}

export default HeadDashboard
