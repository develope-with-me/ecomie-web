import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL
;

export interface LoginResponse {
    token: string;
    responseMessage: {
        success: boolean;
        description: string;
    };
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

// Function to authenticate user
export const authenticateUser = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${BASE_URL}/auth/authenticate`, data);
        console.log(response)
        return response.data;
    } catch (error: any) {
        // Handle API errors
        throw new Error(
            error.response?.data?.responseMessage?.description || "Authentication failed"
        );
    }
};

// Function to confirm account (if needed)
export const confirmAccount = async (token: string): Promise<LoginResponse> => {
    try {
        const response = await axios.post<LoginResponse>(`${BASE_URL}/confirm-account`, {token});
        return response.data;
    } catch (error: any) {
        // Handle API errors
        throw new Error(
            error.response?.data?.responseMessage?.description || "Account confirmation failed"
        );
    }
};

export const registerUser = async (data: RegisterRequest): Promise<any> => {
    try {
        const response = await axios.post(`${BASE_URL}/auth/register`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(
            error.response?.data?.message || "Registration failed. Please try again."
        );
    }
};