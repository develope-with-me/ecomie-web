import React from 'react'
import Button from '../component UI/Button';
interface HeadDashboardProps{
    leftButtonProps:{
            title:string;
            onClick: () => void;
        };
        rightButtonProps:{
            title:string;
            onClick: () => void;
        };
    };
const HeadDashboard: React.FC<HeadDashboardProps>  = ({leftButtonProps, rightButtonProps }) => {


  return (
    <div>
      <div className='flex justify-between '>
      <div className='flex gap-[60px]'>       
         <input  type="text" className='w-64 border-2 border-gray-500 '/>      
          <Button title={leftButtonProps.title} onClick={leftButtonProps.onClick} />
      </div>
      <Button title={rightButtonProps.title} onClick={rightButtonProps.onClick} />
      </div>
    </div>
  )
}

export default HeadDashboard
