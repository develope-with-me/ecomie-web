import axios from 'axios';
import {ProfileDto} from "../../model/profileDto";
import localStorageKeys from "../../constants/localStorageKeys";
import {RequestDto} from "../../model/requestDto";

const baseUrl = process.env.REACT_APP_BASE_URL
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

export const updateUserProfile = async (jsonData : ProfileDto | undefined): Promise<RequestDto> => {
    const userProfileData = await axios.post<RequestDto>(`${baseUrl}/secure/user/update`,
        jsonData, {
        headers: {
            'Content-Type': 'text/plain',
            'Accept': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(localStorageKeys.AuthToken)}`,
        }
    })
    return userProfileData.data;
};

