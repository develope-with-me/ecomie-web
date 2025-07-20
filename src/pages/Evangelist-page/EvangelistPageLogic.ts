import {getUserProfile} from "../../services/userProfileServices/userProfileService";

export const EvangelistPageLogic = () => {
    const getProfileDetails = async () => {
        const response = await getUserProfile();
        console.log(response);
    }

    return { getProfileDetails }
}