import axios from 'axios';
import {ProfileDto} from "../../model/profileDto";
import localStorageKeys from "../../constants/localStorageKeys";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
export const getUserProfile = async (): Promise<ProfileDto> => {
    const userProfileData = await axios.get<ProfileDto>(`${baseUrl}/secure/user/me`, {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(localStorageKeys.AuthToken)}`,
        }
    })
    return userProfileData.data;
};

