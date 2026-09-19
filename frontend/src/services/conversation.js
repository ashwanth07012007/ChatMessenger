import axios from "axios";

import { BASE_URL } from "./api";

export const getMyConversations = async () => {

    const token =
        localStorage.getItem("token");

    const response = await axios.get(
        `${BASE_URL}/api/conversation`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

export const createConversation = async (
    userid
) => {

    const token =
        localStorage.getItem("token");

    const response =
        await axios.post(
            `${BASE_URL}/api/conversation/create`,
            {
                userid: userid
            },
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

    return response.data;
};