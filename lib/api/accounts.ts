import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";

interface FetchAccountsParams {
    page?: number;
    limit?: number;
}

export const fetchListAccounts = async (
    params: FetchAccountsParams = {
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

    const response = await api.get(`/api/accounts/list?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const fetchAccount = async (id?: string): Promise<{ data: any }> => {
    console.log(id)
    const token = await getToken();
    const response = await api.get('/api/accounts/' + id, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};