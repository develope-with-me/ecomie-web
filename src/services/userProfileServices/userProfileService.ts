import axios from 'axios';
import {ProfileDto} from "../../model/profileDto";
const userBaseUrl = process.env.userSecuredUrl

// const api = axios.create({
//     baseURL: 'http://34.224.81.76:80',
// });

export const getUserProfile = async (): Promise<ProfileDto> => {
    const response = await axios.get<ProfileDto>(`${userBaseUrl}/me`);
    return response.data;
};