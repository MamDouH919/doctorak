import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";

interface FetchUsersParams {
    page?: number;
    limit?: number;
}

export const fetchListUsers = async (
    params: FetchUsersParams = {
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

    const response = await api.get(`/api/users/list?${queryParams.toString()}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// active-user
export const toggleUser = async (data: {
    id: string,
}) => {
    const token = await getToken();

    const response = await api.post('/api/users/active-user', data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};