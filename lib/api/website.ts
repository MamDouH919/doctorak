import api from "../api";

//  get specializations
export interface Specialization {
    _id: string;
    name: string;
    slug: string;
    name_en: string;
    // Add more fields as needed
}

export interface GetSpecializationsResponse {
    data: Specialization[];
}

export const getSpecializations = async (): Promise<{
    data: Specialization[];
}> => {
    const response = await api.get('/api/website/specializations');

    return response.data;
};