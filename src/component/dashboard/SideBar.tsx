import React from "react";
import {Link} from "react-router-dom";

const DashboardComponent: React.FC = () => {
    return (
        // <div className="h-screen">
        <div className="w-1/5 dashboard px-10">
            <div>
                <div className="flex mt-20">
                    <i className="fa-solid fa-users text-xl"></i>
                    <p className="ml-8">Ecomie body</p>
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
                            <p className="ml-3">Evangelists</p>
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
                <p className="ml-10">My statistics</p>
            </Link>

            {/* FEATURE FOR ADMIN ONLY */}

            <Link to="/ui/user-accounts" className="flex mt-7">
                <i className="fa-solid fa-user-shield text-xl"></i>
                <p className="ml-9">Manage accounts</p>
            </Link>

            {/* END ADMIN */}

            <Link to="/ui/user-profile" className="flex mt-7">
                <i className="fa-solid fa-user text-xl"></i>
                <p className="ml-11">My profile</p>
            </Link>
            <div className="relative inline-block">
                <div className="relative flex mt-20">
                    <i className="fa-solid fa-right-from-bracket text-xl"></i>
                    <p className="ml-11">Logout</p>
                    <span
                        className="absolute left-full top-0 ml-2 text-gray-500 text-sm italic opacity-0 transition-opacity duration-300 hover:opacity-100">
                        To be implemented shortly
                    </span>
                </div>
            </div>

        </div>

        // </div>

    );
};

export default DashboardComponent;
