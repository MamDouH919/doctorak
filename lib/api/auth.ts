// api to get me
import { getToken } from "@/action/token";
import api from "../api";

export interface User {
    _id: number,
    name: string,
    email: string,
    role: string,
    account: {
        _id: string,
        isPremium: boolean,
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
export const register = async (data: {
    name: string,
    email: string,
    phone: string,
    password: string,
    specialization?: string,
    specialization_needed?: string,
    image: File,
}) => {
    const token = await getToken();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.specialization) formData.append("specialization", data.specialization);
    if (data.specialization_needed) formData.append("specialization_needed", data.specialization_needed);
    formData.append("image", data.image);

    const response = await api.post('/api/auth/register', formData)

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

// verify-email
export const verifyEmail = async (data: {
    email: string,
    otp: number,
}) => {
    const token = await getToken();

    const response = await api.post('/api/auth/verify-email', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};

// resend-otp
export const resendOtp = async (data: {
    email: string,
}) => {
    const token = await getToken();

    const response = await api.post('/api/auth/resend-otp', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};