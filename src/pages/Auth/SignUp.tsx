import React, {useEffect, useState} from "react";
import InputField from '../../component/component UI/InputField';
import {useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";
import bgPicture from '../../images/bg-ecomi.jpg';
import {useSignUpForm} from "./logic/useSignUpForm";
import {FaEye, FaEyeSlash} from "react-icons/fa"; // Import eye icons
import {ToastContainer} from "react-toastify";
import { useGlobalTranslation } from "../../hooks/useGlobalTranslation";


const SignUp: React.FC = () => {
    const { t } = useGlobalTranslation();
    const {
        formValues,
        errors,
        isFormComplete,
        handleChange,
        handleSubmit,
    } = useSignUpForm();
    const [showPassword, setShowPassword] = useState(true);
    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };
    return (
        <div className=" h-screen flex flex-col justify-center items-center relative bg-cover " style={{
            backgroundImage: `url(${bgPicture})`,
        }}>
            <div className=" bg-white py-6 md:py-16 md:px-16 px-7 rounded-lg relative">

                {/* Title */}
                <h1 className="text-3xl font-bold text-black mb-20">{t('signUp.title')}</h1>

                <form onSubmit={handleSubmit} className="md:w-80 w-64 space-y-4">
                    <InputField
                        type="firstname"
                        placeholder={t('signUp.placeholders.firstname')}
                        icon="person"
                        value={formValues.firstname}
                        onChange={(e) => handleChange("firstname", e.target.value)}
                    />
                    {errors.firstname && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
                    )}
                    <InputField
                        type="lastname"
                        placeholder={t('signUp.placeholders.lastname')}
                        icon="person"
                        value={formValues.lastname}
                        onChange={(e) => handleChange("lastname", e.target.value)}
                    />
                    {errors.lastname && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
                    )}
                    <InputField
                        type="email"
                        placeholder={t('signUp.placeholders.email')}
                        icon="email"
                        value={formValues.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}


                    {/* <InputField
              type="text"
              placeholder="Enter your locality"
              icon="person"
              value={formValues.locality}
              onChange={(e) => handleChange("locality", e.target.value)}
            />
            {errors.locality && (
              <p className="text-red-500 text-sm mt-1">{errors.locality}</p>
            )}
    
            <InputField
              type="tel"
              placeholder="Enter your telephone number"
              icon="phone"
              value={formValues.telephone}
              onChange={(e) => handleChange("telephone", e.target.value)}
            />
            {errors.telephone && (
              <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
            )} */}

                    <InputField
                        type={showPassword ? "password" : "text"}
                        placeholder={t('signUp.placeholders.password')}
                        icon="lock"
                        value={formValues.password}

                        onChange={(e) => handleChange("password", e.target.value)}
                    />

                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className=" relative md:left-[300px] left-[240px] bottom-[40px] z-50 flex items-center text-gray-600"
                    >
                        {showPassword ? <FaEyeSlash/> : <FaEye/>}

                    </button>
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    {/* <InputField
          type="password"
          placeholder="Confirm your password"
          icon="lock"
          value={formValues.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
        )} */}

                    {/* Forgot Password */}

                    <div className="md:w-80  w-64 text-right ">
                        <a
                            href="#"
                            className="text-sm text-gray-600 hover:underline hover:text-gray-900"
                        >
                             {t('signUp.forgotPassword')}
                        </a>
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-full mt-32 ${
                            isFormComplete ? "bg-customBlue  hover:bg-blue-950 text-white" : "bg-customBlue text-white cursor-not-allowed"
                        }`}
                        disabled={!isFormComplete}
                    >
                         {t('signUp.submitButton')}
                    </button>
                </form>
                {/* Sign Up Link */}
                <Link to="/">
                    <p className="text-sm text-gray-600 mt-4">
                        <a href="#" className="hover:underline hover:text-gray-900">
                        {t('signUp.loginLink')}
                        </a>
                    </p>
                </Link>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SignUp
