import axios from "axios";
import { BASE_URL } from "./api";

export const getUsers = async () => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.get(
            `${BASE_URL}/api/user`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};

export const getMyProfile = async () => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.get(
            `${BASE_URL}api/user/profile`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

    return response.data;
};