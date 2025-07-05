import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";
import { getLang } from "@/action/lang";

interface FetchParams {
    page?: number;
    limit?: number;
}

export const fetchListArticles = async (
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

    const response = await api.get(`/api/articles/list?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const createArticles = async (data: {
    title: string,
    content: string,
    account: string
}) => {
    const token = await getToken();

    const response = await api.post('/api/articles/create', data, {
        headers: {
            'Authorization': `Bearer ${token}`,

        },
    })

    return response.data;
};

export const updateArticles = async (data: {
    id: string,
    title: string,
    content: string,
    account: string
}) => {
    const token = await getToken();
    const lang = await getLang();

    const response = await api.put('/api/articles/update', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Language': lang,
        },
    })

    return response.data;
};

export const deleteArticles = async (id: string) => {
    const token = await getToken();

    const response = await api.delete('/api/articles/delete/' + id, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};