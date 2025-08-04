import React, {useEffect, useState} from "react";
import {useGlobalTranslation} from "../../translate/translation-provider";
import InputComponent from "../../component/component UI/inputComponent";
import {Props} from "@fortawesome/react-fontawesome";
import {ProfileDto} from "../../model/profileDto";
import {useLoader} from "../../component/loader/loaderProvider";
import {updateUserProfile} from "../../services/userProfileServices/userProfileService";
import {toast} from "react-toastify";
import {RequestDto} from "../../model/requestDto";

export interface MyProps {
    profileData: ProfileDto | undefined;
}

const UserProfileForm: React.FC<MyProps> = ({profileData}) => {
    const {t} = useGlobalTranslation();
    const {setLoading} = useLoader();
    const [updateProfile, handleUpdateProfile] = useState<RequestDto>();

    const [parentInputValue, setParentInputValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");


    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>): undefined => {
        // const newValue = event.target.value;
        // setParentInputValue(newValue);

        // Basic validation as you type (moved to parent, or a separate validation helper)
        // if (newValue.length < 3 && newValue.length > 0) {
        //     setErrorMessage("Input must be at least 3 characters.");
        // } else {
        //     setErrorMessage("");
        // }
    };

    // useEffect(() => {
    //     setLoading(true);
    //     updateUserProfile(profileData).then(res => {
    //         console.log(res);
    //         handleUpdateProfile(res);
    //         setLoading(false);
    //         toast.success('profile_updated_successfully.');
    //     });
    // })

    return (
        <div>
            <form>
                <h2 className="text-2xl font-bold mb-6 text-center  text-gray-950">{t("updateProfile")}</h2>
                <div>
                    <InputComponent
                        label={t("fullName")}
                        type="text"
                        name="fullName"
                        value={(profileData?.firstname + ' ' + profileData?.lastname) || undefined}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label={t("email")}
                        type="email"
                        name="email"
                        value={profileData?.email || undefined}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label={t("locality")}
                        type="text"
                        name="locality"
                        value={profileData?.region || undefined}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label={t("role")}
                        type="text"
                        name="role"
                        disableField
                        value={profileData?.role || undefined}
                        onChange={handleInputChange}
                    />
                    <InputComponent
                        label={t("contact")}
                        type="text"
                        name="contact"
                        value={profileData?.phoneNumber || undefined}
                        onChange={handleInputChange}
                    />
                </div>
                <div className='mt-10 flex items-center justify-center'>
                    <button
                        className="text-sm p-2 px-6 rounded rounded-tl-xl rounded-br-xl bg-customBlue text-white">
                        {t("updateProfile")}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default UserProfileForm;