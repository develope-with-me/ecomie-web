import React, { useState } from "react";
import InputField from '../../component/component UI/InputField';
import { Link } from "react-router-dom";
import bgPicture from '../../images/bg-ecomi.jpg';
import { useLoginForm } from "./logic/useLoginForm";
  
const Login: React.FC = () => {
    const {
      formValues,
      errors,
      handleChange,
      handleSubmit,
    } = useLoginForm();
    
      return (
        <div className="flex flex-col justify-center items-center h-screen relative bg-cover " style={{backgroundImage:`url(${bgPicture})`,
        }}>
        <div className=" bg-white p-6 md:p-16 rounded-lg ">
          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-20">LOGIN</h1>
    
          <form onSubmit={handleSubmit} className="md:w-80 w-64 space-y-4">
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
              className="w-full bg-blue-900 text-white py-2 rounded-full mt-6 hover:bg-blue-800"
            >
LOGIN            </button>
          </form>

          <p className="text-sm text-gray-600 mt-4">
        <a href="#" className="hover:underline hover:text-gray-900">
         <Link to='/signUp'>SIGN UP</Link>   
        </a>
      </p>
        </div>
        </div>
      );
}

export default Login
