import React, {useEffect, useState} from "react";
import DashboardComponent from "../../component/dashboard/SideBar";
import Layout from "../wrapper-layout/layout";
import axios from "axios";
import {ProfileDto} from "../../model/profileDto";
import localStorageKeys from "../../constants/localStorageKeys";

const UserProfilePage: React.FC = () => {
  const [profile, setProfile] = useState([]);

  const baseUrl = process.env.REACT_APP_BASE_URL

  useEffect(() => {
    axios.get<ProfileDto>(`${baseUrl}/secure/user/me`, {
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json, text/plain, */*',
        Authorization: `Bearer ${localStorage.getItem(localStorageKeys.AuthToken)}`,
      }
    })
        .then(res => console.log(res))
  })

  return (
    // <div className="h-screen flex">

    <Layout>
      {/*< DashboardComponent />*/}
      <div className="md:w-3/4 w-auto ">
        <h5 className="text-2xl px-12 pt-6">Account Profile</h5>
        <div className="w-4/5 mt-5 md:ml-12 ml-8 rounded-xl profile md:pl-8 pl-6 pt-5">
          <h6 className="font-bold text-xl">User Information</h6>
          <div className="mt-4">
            <p>Full name:</p>
            <p className="font-bold">Hotou Njiowouo Morelle Olivia</p>
          </div>
          <div className="mt-4">
            <p>Email:</p>
            <p className={"font-bold"}>hotoumorelle@gmail.com</p>
          </div>
          <div className="mt-4">
            <p>Locality:</p>
            <p className="font-bold">Buea</p>
          </div>
          <div className="mt-4">
            <p>Role:</p>
            <p className="font-bold">Evangeliste</p>
          </div>
          <div className="mt-4">
            <p>Contact:</p>
            <p className="font-bold">682 096 246</p>
          </div>
          <div className="mt-20 pb-5">
            <div className="mb-1">
              <p>
                Do you want to become an ecomist?
                <span>
                  <i>
                    <a className="text-blue-500">
                      {" "}
                      Click request to be an ecomist.
                    </a>
                  </i>
                </span>
              </p>
            </div>
            <button className="p-1 px-5 rounded rounded-tl-xl rounded-br-xl edit-button">
              Edit profile
            </button>
          </div>
        </div>
      </div>
    </Layout>
    // </div>
  );
};

export default UserProfilePage;
