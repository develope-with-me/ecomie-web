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
            <div className='md:flex md:justify-between left-[-50px] '>
                <div className='flex  md:gap-[30px] gap-[15px]'>
                    <input type="text" className='md:w-64 w-[145px] h-7  border-2 rounded border-gray-500 '/>
                    <Button title={selectButtonProps?.title || ''} onClick={selectButtonProps?.onClick}/>
                </div>
                <div className='ml-[147px] mt-6 md:mt-0'>
                <Button title={addModalButtonProps?.title || ''}
                        icon={'fa-solid fa-plus pr-3'}
                        onClick={addModalButtonProps?.onClick}/>
                        </div>
            </div>
        </div>
    )
}

export default HeadDashboard
