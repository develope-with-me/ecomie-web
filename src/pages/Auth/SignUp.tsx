import React, { useEffect, useState } from "react";
import InputField from '../../component/component UI/InputField';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import bgPicture from '../../images/bg-ecomi.jpg';
import { useSignUpForm } from "./logic/useSignUpForm";
const SignUp: React.FC = () => {
  const {
    formValues,
    errors,
    isFormComplete,
    handleChange,
    handleSubmit,
  } = useSignUpForm();

      return (
        <div className=" h-screen flex flex-col justify-center items-center relative bg-cover " style={{backgroundImage:`url(${bgPicture})`,
      }}>                <div className=" bg-white py-6 md:py-16 md:px-28 px-7 rounded-lg ">

          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-20">SIGN UP</h1>
    
          <form onSubmit={handleSubmit} className="md:w-80 w-64 space-y-4">
            <InputField
              type="firstname"
              placeholder="Enter your firstname"
              icon="person"
              value={formValues.firstname}
              onChange={(e) => handleChange("firstname", e.target.value)}
            />
            {errors.firstname && (
              <p className="text-red-500 text-sm mt-1">{errors.firstname}</p>
            )}
            <InputField
              type="lastname"
              placeholder="Enter your lastname"
              icon="person"
              value={formValues.lastname}
              onChange={(e) => handleChange("lastname", e.target.value)}
            />
            {errors.lastname && (
              <p className="text-red-500 text-sm mt-1">{errors.lastname}</p>
            )}
            <InputField
              type="email"
              placeholder="Enter your email"
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
              type="password"
              placeholder="Enter your password"
              icon="lock"
              value={formValues.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
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
          Forgot password?
        </a>
      </div>

    
            {/* Login Button */}
            <button
              type="submit"
              className={`w-full py-2 rounded-full mt-32 ${
                isFormComplete ? "bg-blue-900 hover:bg-blue-800 text-white" : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!isFormComplete}
            >
              SIGN UP
            </button>
          </form>
          {/* Sign Up Link */}
          <Link to="/">
      <p className="text-sm text-gray-600 mt-4">
        <a href="#" className="hover:underline hover:text-gray-900">
         lOGIN
        </a>
      </p>
      </Link>
        </div>
        </div>
      );
}

export default SignUp
