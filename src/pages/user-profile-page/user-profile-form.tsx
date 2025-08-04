import React from "react";
import {useGlobalTranslation} from "../../translate/translation-provider";
import InputComponent from "../../component/component UI/inputComponent";

const UserProfileForm: React.FC = () => {
    const {t} = useGlobalTranslation();

    return (
        <div>
            <form action="">
                <h2 className="text-2xl font-bold mb-6 text-center  text-gray-950">{t("updateProfile")}</h2>
                <div>
                    <InputComponent
                        label={t("fullName")}
                        type="text"
                        name="fullName"
                    />
                    <InputComponent
                        label={t("email")}
                        type="email"
                        name="email"
                    />
                    <InputComponent
                        label={t("locality")}
                        type="text"
                        name="locality"
                    />
                    <InputComponent
                        label={t("role")}
                        type="text"
                        name="role"
                        disableField
                    />
                    <InputComponent
                        label={t("contact")}
                        type="text"
                        name="contact"
                    />
                </div>
                <div className='mt-10 flex items-center justify-center'>
                    <button
                        className="text-sm p-2 px-6 rounded rounded-tl-xl rounded-br-xl bg-customBlue text-white">{t("updateProfile")}</button>
                </div>
            </form>
        </div>
    )
}

export default UserProfileForm;