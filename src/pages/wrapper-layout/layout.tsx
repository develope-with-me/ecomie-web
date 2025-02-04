import React from "react";
import DashboardComponent from "../../component/dashboard/SideBar";
type WrapperProps = {
  children: React.ReactNode;
};

const Layout: React.FC<WrapperProps> = ({ children }) => {
  return (
    <div>
      <div className="layout">
        {/*<app-navbar></app-navbar>*/}
        <div className="main-content h-screen flex flex-row">
          <DashboardComponent />
          <div className="content flex-grow ">
            {children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
