import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../modal/Modal";
import { useGlobalTranslation } from "../../hooks/useGlobalTranslation";

interface DashboardComponentProps {
    style?: string;
  }

const DashboardComponent: React.FC<DashboardComponentProps> =  ({ style }) => {
  const { t } = useGlobalTranslation();
  const navigate = useNavigate();
   const [confirmLogout, setConfirmLogout]=useState(false);

   const handleLogout = () =>{

    
        localStorage.removeItem("authToken");  // Clear authentication token
        localStorage.removeItem("userData");   // If you store user data, clear it too
        navigate("/");  // Redirect to homepage or login page
  
   }
   
   
   
    return (
        // <div className="h-screen">
        <div className={style || "w-1/5 dashboard px-10 md:block hidden"}>
            <div>
                <div className="flex mt-20">
                    <i className="fa-solid fa-users text-xl"></i>
                    <p className="ml-8">{t('dashboard.ecomieBody')}</p>
                </div>
                <ul>

                    {/* COACHES AND STAFFS TO BE IMPLEMENT IN THE FUTURE --- KEEP CODE SAFE FOR FAST USE IN FUTURE */}

                    {/*<li className="flex mt-2">*/}
                    {/*    <i className="ml-14 mt-1 fa-solid fa-arrow-right "></i>*/}
                    {/*    <p className="ml-3">Staffs</p>*/}
                    {/*</li>*/}
                    {/*<li className="flex mt-2">*/}
                    {/*    <i className="ml-14 mt-1 fa-solid fa-arrow-right"></i>*/}
                    {/*    <p className="ml-3">Coaches</p>*/}
                    {/*</li>*/}

                    {/* END OF COACHES AND STAFFS */}

                    <div className="relative inline-block">
                        <li className="flex mt-2">
                            <i className="ml-14 mt-1 fas fa-arrow-right"></i>
                            <p className="ml-3">{t('dashboard.evangelists')}</p>
                        </li>
                        <span
                            className="absolute left-full top-0 ml-2 text-gray-500 text-sm italic opacity-0 transition-opacity duration-300 hover:opacity-100">
                                To be implemented shortly
                            </span>
                    </div>

                </ul>
            </div>

            {/* SIDEBAR NOTIFICATIONS AND PRAYER TOPIC TO BE IMPLEMENTED IN THE FUTURE --- KEEP CODE SAFE FOR FAST USE IN FUTURE */}


            {/*<div className="flex mt-7">*/}
            {/*    <i className="fa-solid fa-bell text-xl"></i>*/}
            {/*    <p className="ml-9">Notifications</p>*/}
            {/*</div>*/}
            {/*<div className="flex mt-7">*/}
            {/*    <i className="fa-solid fa-person-praying text-xl"></i>*/}
            {/*    <p className="ml-10">Prayer topics</p>*/}
            {/*</div>*/}

            {/* END OF SIDEBAR NOTIFICATIONS AND PRAYER TOPIC */}


            {/* SIDEBAR EVANGELISM CHALLENGES TO BE IMPLEMENTED IN THE FUTURE --- KEEP CODE SAFE FOR FAST USE IN FUTURE*/}

            {/*<div>*/}
            {/*    <div className="flex mt-7">*/}
            {/*        <i className="fa-solid fa-bullhorn text-lg"></i>*/}
            {/*        <p className="ml-9">Evangelism</p>*/}
            {/*    </div>*/}
            {/*    <ul>*/}
            {/*        <li className="flex mt-2">*/}
            {/*            <i className="ml-14 mt-1 fa-solid fa-arrow-right"></i>*/}
            {/*            <p className="ml-3">SMICT challenge</p>*/}
            {/*        </li>*/}
            {/*        <li className="flex mt-2">*/}
            {/*            <i className="ml-14 mt-1 fa-solid fa-arrow-right"></i>*/}
            {/*            <p className="ml-3">KETMINA challenge</p>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}


            {/* END OF SIDEBAR EVANGELISM CHALLENGES*/}


            <Link to="/ui/statistics" className="flex mt-7">
                <i className="fas fa-chart-bar text-xl"></i>
                <p className="ml-10">{t('dashboard.myStatistics')}</p>
            </Link>

            {/* FEATURE FOR ADMIN ONLY */}

            <Link to="/ui/user-accounts" className="flex mt-7">
                <i className="fa-solid fa-user-shield text-xl"></i>
                <p className="ml-9">{t('dashboard.manageAccounts')}</p>
            </Link>

            {/* END ADMIN */}

            <Link to="/ui/user-profile" className="flex mt-7">
                <i className="fa-solid fa-user text-xl"></i>
                <p className="ml-11">{t('dashboard.myProfile')}</p>
            </Link>
            <div className="relative inline-block">
                <div className="relative flex mt-20 cursor-pointer" onClick={() => setConfirmLogout(true) } >
                    <i className="fa-solid fa-right-from-bracket text-xl"></i>
                    <p className="ml-11">{t('dashboard.logout')}</p>

</div>
</div>
                   
    
      {/* Custom Confirmation Modal */}
      {confirmLogout && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-80">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">{t('logoutModal.title')}</h2>                       <p className="text-gray-700 mb-6">{t('logoutModal.message')}</p>

            <div className="flex justify-end space-x-40">
              <button
                className=" h-8 px-2 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                onClick={() => setConfirmLogout(false)}
              >
              {t('logoutModal.cancel')}
              </button>
              <button
                className="h-8 px-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                onClick={handleLogout}
              >
                   {t('logoutModal.logout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardComponent;
