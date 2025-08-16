import axios from 'axios';
import React, {useEffect} from "react";
import {ProfileDto} from "../../model/profileDto";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

// const api = axios.create({
//     baseURL: 'http://34.224.81.76:80',
// });

// const GetUserProfile: () => void = () => {
    export const GetUserProfile = async () => {
        useEffect(() => {
            axios.get<ProfileDto>(`${baseUrl}/secure/user/me`)
                .then(res => console.log(res))
        })
    };
// }

export default GetUserProfile;

