import axios from "axios";

import { BASE_URL } from "./api";

export const getMessages = async (
    conversationId
) => {

    const token =
        localStorage.getItem("token");

    const response = await axios.get(
        `${BASE_URL}/api/message/${conversationId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};