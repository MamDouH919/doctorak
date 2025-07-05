import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";
import { getLang } from "@/action/lang";

interface FetchParams {
    page?: number;
    limit?: number;
}

export interface createClinic {
    name: string,
    phone: string,
    address: string,
    mobile: string,
    governorate: string,
    city: string,

    appointments: {
        day: string,
        timeFrom: string,
        timeTo: string
    }[],
    account: string
}

export const fetchListClinics = async (
    params: FetchParams = {
        page: 1,
        limit: 20,
    }
): Promise<{
    data: any,
    pagination: PaginatorInfo
}> => {
    const token = await getToken();

    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', String(params.page));
    if (params.limit) queryParams.append('limit', String(params.limit));

    const response = await api.get(`/api/clinics/list?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const createClinic = async (data: createClinic) => {
    const token = await getToken();

    const response = await api.post('/api/clinics/create', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};

export const updateClinic = async (data: createClinic & { id: string }) => {
    const token = await getToken();
    const lang = await getLang(); 

    const response = await api.put('/api/clinics/update', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Language': lang,
        },
    })

    return response.data;
};

export const deleteClinic = async (id: string) => {
    const token = await getToken();

    const response = await api.delete('/api/clinics/delete/' + id, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};