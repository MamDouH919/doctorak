// api to get me
import { getToken } from "@/action/token";
import api from "../api";

interface User {
    _id: number,
    name: string,
    email: string,
    role: string,
    account: {
        _id: string,
    },
}

export const getMe = async (): Promise<User> => {
    const token = await getToken();

    const response = await api.get('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data.data;
};

// signup
export const signup = async (data: {
    name: string,
    email: string,
    password: string,
}) => {
    const token = await getToken();

    const response = await api.post('/api/auth/register', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};

// login
export const login = async (data: {
    email: string,
    password: string,
}) => {
    const token = await getToken();

    const response = await api.post('/api/auth/login', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};