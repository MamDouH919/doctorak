import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";
import { getLang } from "@/action/lang";

interface FetchParams {
    page?: number;
    limit?: number;
}

export const fetchListFaqs = async (
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

    const response = await api.get(`/api/faqs/list?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const createFaq = async (data: {
    question: string,
    answer: string,
    account: string
}) => {
    const token = await getToken();

    const response = await api.post('/api/faqs/create', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};

export const updateFaq = async (data: {
    id: string,
    question: string,
    answer: string,
    account: string
}) => {
    const token = await getToken();
    const lang = await getLang();

    const response = await api.put('/api/faqs/update', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Language': lang,
        },
    })

    return response.data;
};

export const deleteFaq = async (id: string) => {
    const token = await getToken();

    const response = await api.delete('/api/faqs/delete/' + id, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};