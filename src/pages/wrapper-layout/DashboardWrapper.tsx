import React from 'react'
import HeadDashboard from '../../component/dashboard/HeadDashboard'
import Layout from './layout'

interface ButtonProps{
    title:string;
    onClick: () => void;
}
interface DashboardWrapperProps {
  leftButtonProps: ButtonProps;
  rightButtonProps: ButtonProps; 
  children?: React.ReactNode;  
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({leftButtonProps, rightButtonProps, children} ) => {
  return (
    <Layout>
    <div className='px-7 py-20'>
      <HeadDashboard leftButtonProps={leftButtonProps} rightButtonProps={rightButtonProps} />
      <div>
      {children}
      </div>
       
    </div>
  </Layout>
);
};

export default DashboardWrapper
