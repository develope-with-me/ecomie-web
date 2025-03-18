import React, { useState } from "react";
import InputField from '../../component/component UI/InputField';
import { Link } from "react-router-dom";
import bgPicture from '../../images/bg-ecomi.jpg';
import { useLoginForm } from "./logic/useLoginForm";
import { ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useTranslation } from "react-i18next";
  
const Login: React.FC = () => {
 const { t, i18n } = useTranslation();


     const {
      formValues,
      errors,
      handleChange,
      handleSubmit,
    } = useLoginForm();
    const [showPassword, setShowPassword]= useState(true);
    const togglePasswordVisibility = () => {
      setShowPassword((prevState) => !prevState);
    };
      return (
        <div className="flex flex-col justify-center items-center h-screen relative bg-cover " style={{backgroundImage:`url(${bgPicture})`,
        }}>
                <ToastContainer />
         

        <div className=" bg-white p-6 md:p-16 rounded-lg relative">
          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-20">{t("loginButton")} </h1>
    
          <form onSubmit={handleSubmit} className="md:w-80 w-64 space-y-4">
            <InputField
              type="email"
              placeholder={t("emailPlaceholder")}
              icon="email"
              value={formValues.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
    
            <InputField
type={showPassword ? "password":"text" }              placeholder={t("passwordPlaceholder")}
              icon="lock"
              value={formValues.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className=" absolute right-14 top-1/2 transform -translate-y-1/2 z-50 flex items-center text-gray-600"
            >
              {showPassword?<FaEyeSlash />:  <FaEye /> }
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
    
    <div className="md:w-80  w-64 text-right ">
        <a
          href="#"
          className="text-sm text-gray-600 hover:underline hover:text-gray-900"
        >
          {t("forgotPassword")}
        </a>
      </div>
    
            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-2 rounded-full mt-6 hover:bg-blue-800"
            >
{t("loginButton")}           </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
        <a href="#" className="hover:underline hover:text-gray-900">
         <Link to='/signUp'>{t("signUpLink")}</Link>   
        </a>
      </p>
        </div>
        </div>
      );
}

export default Login
