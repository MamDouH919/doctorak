// api to get me
import { getToken } from "@/action/token";
import api from "../api";

export const getMe = async () => {
    const token = await getToken();

    const response = await api.get('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};