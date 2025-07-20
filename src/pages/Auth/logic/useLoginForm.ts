import {useState} from "react";
import {authenticateUser} from "../../../services/authService";
import LOCAL_STORAGE_KEYS from "../../../constants/localStorageKeys";
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
interface FormValues {
    email: string;
    password: string;
}

export const useLoginForm = () => {
    const [formValues, setFormValues] = useState<FormValues>({
        email: "",
        password: "",
    });

    const navigate = useNavigate(); // Initialize the navigate function


    const [errors, setErrors] = useState<Partial<FormValues>>({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes
    const handleChange = (field: keyof FormValues, value: string) => {
        setFormValues({...formValues, [field]: value});
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError(null); // Clear previous errors

        if (validate()) {
            setLoading(true); // Show loading indicator
            try {
                const response = await authenticateUser(formValues);

                console.log("API Response:", response);

                if (response.token) {
                    const authToken = response.token;
                    // Save token to localStorage or context
                    localStorage.setItem(LOCAL_STORAGE_KEYS.AuthToken, authToken);
                    
                   navigate ('/ui/user-profile');
                    toast.success("Login successful!");
                } else {
                    toast.error("Your credentials don't match. Please try again.");
                }
            } catch (error: any) {
                setApiError(error.message);
                toast.error("Your credentials don't match. Please try again.");
            } finally {
                setLoading(false); // Stop loading indicator
            }
        }
    };

    return {
        formValues,
        errors,
        handleChange,
        handleSubmit,
    };
};