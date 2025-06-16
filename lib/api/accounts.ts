import { getToken } from "@/action/token";
import api from "../api";
import { PaginatorInfo } from "@/types";
import { CreateAccount } from "@/types/account";

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


// get all accounts
export const listServicesDropDown = async () => {
    const token = await getToken();
    const response = await api.get('/api/dropdown/accounts', {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};

export const updateAccount = async (id: string, data: CreateAccount) => {
    const token = await getToken();

    const response = await api.put('/api/accounts/update/' + id, data, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    })

    return response.data;
};