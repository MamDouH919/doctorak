import api from "../api";

//  get specializations
export interface Specialization {
    _id: string;
    name: string;
    slug: string;
    name_en: string;
    // Add more fields as needed
}

export interface Doctors {
    _id: string;
    domain: string;
    visitors: number;
    description: string;
    image:{
        url: string;
        alt: string;
    }
    specialization:{
        name: string;
        slug: string;
    }
    siteName: string;
    user: {
        _id: string;
        name: string;
    }
    // Add more fields as needed
}

export interface City {
    en: string;
    ar: string;
}
export interface Governorate {
    _id: string;
    governorate: {
        en: string;
        ar: string;
    };
    cities: City[];
    // Add more fields as needed
}

interface FetchParams {
    limit?: number;
}

interface FetchAccountsParams {
    showInHomePage?: boolean;
    name?: string;
    specialty?: string;
}

export interface GetSpecializationsResponse {
    data: Specialization[];
}

export const getSpecializations = async (
    params: FetchParams = {
        limit: 0,
    }
): Promise<{
    data: Specialization[];
}> => {
    const queryParams = new URLSearchParams();
    if (params.limit) queryParams.append('limit', String(params.limit));

    const response = await api.get(`/api/website/specializations?${queryParams.toString()}`);

    return response.data;
};

export const getDoctors = async (
    params: FetchAccountsParams = {
        showInHomePage: undefined,
        name: undefined,
        specialty: undefined,
    }
): Promise<{
    data: Doctors[];
}> => {
    const queryParams = new URLSearchParams();
    if (params.showInHomePage !== undefined) queryParams.append('showInHomePage', String(params.showInHomePage));
    if (params.name) queryParams.append('name', params.name);
    if (params.specialty) queryParams.append('specialty', params.specialty);

    const response = await api.get(`/api/website/doctors?${queryParams.toString()}`);

    return response.data;
};

export const getGovernorate = async (): Promise<{
    data: Governorate[];
}> => {
    const response = await api.get(`/api/website/governorate`);

    return response.data;
};