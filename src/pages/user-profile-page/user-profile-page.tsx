import React, {useEffect, useState} from "react";
import Layout from "../wrapper-layout/layout";
import {ProfileDto} from "../../model/profileDto";
import Modal from "../../component/modal/Modal";
import UserProfileForm from "./user-profile-form";
import {useGlobalTranslation} from "../../translate/translation-provider";
import {getUserProfile} from "../../services/userProfileServices/userProfileService"
import LoaderProvider, {useLoader} from "../../component/loader/loaderProvider"

const UserProfilePage: React.FC = () => {
    const [profile, setProfile] = useState<ProfileDto>();
    const [openForm, setOpenForm] = useState(false);
    const [requestModal, setRequestModal] = useState(false);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const {t} = useGlobalTranslation();
    const {setLoading} = useLoader();

    const handleAddStatisticsForm = () => {
        setOpenForm(!openForm);
        setProfile(profile);
        console.log(profile);
    };
    const handleRequest = () => {
        setRequestModal(!requestModal);
        // setProfile(profile);
        // console.log(profile);
    };
    const closeForm = () => {
        setOpenForm(false);
        setRequestModal(false);
        setEditIndex(null);
    }

    useEffect(() => {
        // setLoading(true);
        getUserProfile().then(res => {
            setProfile(res);
            // setLoading(false);
        })
            .catch(error => {
                console.log("Error: ", error.message);
            });
    }, [])

    return (
        <Layout>
            {/*<LoaderProvider />*/}
            <div className="md:w-3/4 w-auto ">
                {/*<LoaderProvider></LoaderProvider>*/}
                <h5 className="text-2xl px-12 pt-6">{t("accountProfile")}</h5>
                <div className="w-4/5 mt-5 md:ml-12 ml-8 rounded-xl profile md:pl-8 pl-6 pt-5">
                    <h6 className="font-bold text-xl">{t("userInformation")}</h6>
                    <div className="mt-4">
                        <p>{t("fullName")}:</p>
                        <p className="font-bold">{profile?.firstname} {profile?.lastname}</p>
                    </div>
                    <div className="mt-4">
                        <p>{t("email")}:</p>
                        <p className={"font-bold"}>{profile?.email}</p>
                    </div>
                    <div className="mt-4">
                        <p>{t("locality")}:</p>
                        <p className="font-bold">{profile?.city}</p>
                    </div>
                    <div className="mt-4">
                        <p>{t("role")}:</p>
                        <p className="font-bold">{profile?.role}</p>
                    </div>
                    <div className="mt-4">
                        <p>{t("contact")}:</p>
                        <p className="font-bold">{profile?.phoneNumber}</p>
                    </div>
                    <div className="mt-20 pb-5">
                        <div className="mb-1">
                            <p>
                                {t("ecomistRequest")}?
                                <span>
                  <i>
                          <span className="text-blue-500 cursor-pointer" onClick={handleRequest}>
                              {" "}
                              {t("clickToBeAnEcomist")}.
                            </span>
                      <div className={`overlay-menu ${requestModal ? 'block' : 'hidden'}`}>
                            <Modal onClose={closeForm}>
                                <div></div>
                                {/*<UserProfileForm profileData ={profile}/>*/}
                            </Modal>
                        </div>

                  </i>
                </span>
                            </p>
                        </div>
                        <button className="p-1 px-5 rounded rounded-tl-xl rounded-br-xl edit-button"
                                onClick={handleAddStatisticsForm}
                        >
                            {t("editProfile")}
                        </button>
                        <div className={`overlay-menu ${openForm ? 'block' : 'hidden'}`}>
                            <Modal onClose={closeForm}>
                                <UserProfileForm profileData={profile}/>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UserProfilePage;
