import React, { useState } from "react";
import InputField from '../../component/component UI/InputField';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface FormValues {
    email: string;
    password: string;
    role: string;
    telephone: string;
  }
  
const SignUp: React.FC = () => {
    const navigate = useNavigate();

    const [formValues, setFormValues] = useState<FormValues>({
        email: "",
        password: "",
        role: "",
        telephone: "",
      });
    
      const [errors, setErrors] = useState<Partial<FormValues>>({});
    
      // Validation logic
      const validate = (): boolean => {
        const newErrors: Partial<FormValues> = {};
    
        if (!formValues.email) {
          newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
          newErrors.email = "Invalid email format";
        }
    
        if (!formValues.password) {
          newErrors.password = "Password is required";
        } else if (formValues.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters long";
        }
    
        if (!formValues.role) {
          newErrors.role = "Role is required";
        }
    
        if (!formValues.telephone) {
          newErrors.telephone = "Telephone number is required";
        } else if (!/^\d{10}$/.test(formValues.telephone)) {
          newErrors.telephone = "Telephone number must be 10 digits";
        }
    
        setErrors(newErrors);
    
        return Object.keys(newErrors).length === 0;
      };
    
      // Handle input changes
      const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues({ ...formValues, [field]: value });
      };
    
      // Handle form submission
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
          console.log("Form submitted successfully", formValues);
          navigate("/"); // Correctly use navigate here

        }
      };
    
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-white">
          {/* Title */}
          <h1 className="text-3xl font-bold text-black mb-20">SIGN UP</h1>
    
          <form onSubmit={handleSubmit} className="w-80 space-y-4">
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
    
            <InputField
              type="text"
              placeholder="Enter your role"
              icon="person"
              value={formValues.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role}</p>
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
            )}
      {/* Forgot Password */}

<div className="w-80 text-right ">
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
              className="w-full bg-blue-900 text-white py-2 rounded-full mt-32  hover:bg-blue-800 "
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
      );
}

export default SignUp
