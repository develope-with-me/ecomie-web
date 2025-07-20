// useSignUpForm.ts
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../services/authService";

interface FormValues {
  email: string;
  password: string;
//   locality: string;
//   telephone: string;
  firstname: string;
  lastname: string;
//   confirmPassword: string;
}

export const useSignUpForm = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<FormValues>({
    email: "",
    password: "",
    // locality: "",
    // telephone: "",
    firstname: "",
    lastname: "",

    // confirmPassword: "",
  });

  const [errors, setErrors] = useState<Partial<FormValues>>({});
  const [isFormComplete, setIsFormComplete] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // API error state
  const [loading, setLoading] = useState(false); // Loading state
  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every((value) => value.trim() !== "");
    setIsFormComplete(allFieldsFilled);
  }, [formValues]);

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

    // if (!formValues.confirmPassword) {
    //   newErrors.confirmPassword = "Confirm password is required";
    // } else if (formValues.confirmPassword !== formValues.password) {
    //   newErrors.confirmPassword = "Passwords do not match";
    // }

    // if (!formValues.locality) {
    //   newErrors.locality = "Locality is required";
    // }

    if (!formValues.firstname) {
      newErrors.firstname = "Name is required";
    }
    if (!formValues.lastname) {
      newErrors.lastname = "Name is required";
    }

    // if (!formValues.telephone) {
    //   newErrors.telephone = "Telephone number is required";
    // } else if (!/^\d{10}$/.test(formValues.telephone)) {
    //   newErrors.telephone = "Telephone number must be 10 digits";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormValues, value: string) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null); // Clear any previous API errors

    if (validate()) {
        setLoading(true); // Show loading indicator
        try {
            const response = await registerUser(formValues); // Call the registration API
            console.log("Registration successful:", response);
            alert("Registration successful!");
            navigate("/"); // Redirect on success
          } catch (error: any) {
            setApiError(error.message || "Registration failed. Please try again."); // Set API error
          } finally {
            setLoading(false); // Hide loading indicator
          }
        }
      };

  return {
    formValues,
    errors,
    isFormComplete,
    handleChange,
    handleSubmit,
    apiError,
    loading,

  };
};