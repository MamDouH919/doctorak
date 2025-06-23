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

import { AxiosProgressEvent } from 'axios';

interface UploadOptions {
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}

export const uploadAccountImage = async (
    file: File,
    accountId: string,
    alt: string,
    options?: UploadOptions
) => {
    try {
        const token = await getToken();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("accountId", accountId);
        formData.append("alt", alt);

        const response = await api.post('/api/images/upload-image', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            onUploadProgress: options?.onUploadProgress,
        });

        return response.data;
    } catch (error: any) {
        console.error("❌ Error uploading account image:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteAccountImage = async (accountId: string, imagePath: string) => {
    const response = await fetch('/api/images/remove-image', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accountId, imagePath }),
    });

    if (!response.ok) {
        throw new Error(`Failed to delete image: ${await response.text()}`);
    }

    return await response.json();
};
