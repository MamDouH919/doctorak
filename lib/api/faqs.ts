import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";

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

// export const fetchAccount = async (id?: string): Promise<{ data: any }> => {
//     const token = await getToken();
//     const response = await api.get('/api/accounts/' + id, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//         },
//     })

//     return response.data;
// };

export const createFaq = async (data: any) => {
    const token = await getToken();

    const response = await api.post('/api/faqs/create', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })

    return response.data;
};