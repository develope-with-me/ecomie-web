import React from 'react'
import HeadDashboard from '../../component/dashboard/HeadDashboard'
import Layout from './layout'

interface ButtonProps{
    title:string;
    onClick: () => void;
}
interface DashboardWrapperProps {
  selectButtonProps: ButtonProps;
  addModalButtonProps: ButtonProps;
  children?: React.ReactNode;  
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({selectButtonProps, addModalButtonProps, children} ) => {
  return (
    <Layout>
    <div className='md:px-7 py-20 px-5 '>
      <HeadDashboard selectButtonProps={selectButtonProps} addModalButtonProps={addModalButtonProps} />
      <div>
      {children}
      </div>
       
    </div>
  </Layout>
);
};

export default DashboardWrapper
