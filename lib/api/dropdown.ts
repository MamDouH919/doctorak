import api from "../api";


export interface Governorate {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    // Add more fields as needed
}

export interface Cities {
    _id: string;
    name: {
        en: string;
        ar: string;
    };
    // Add more fields as needed
}

export const getGovernorate = async (): Promise<{
    data: {
        governorates: Governorate[];
    }
}> => {
    const response = await api.get(`/api/dropdown/governorate`);

    return response.data;
};

export const getCities = async (id: string): Promise<{
    data: {
        cities: Cities[];
    }
}> => {
    const response = await api.get(`/api/dropdown/cities`, {
        params: {
            id: id
        }
    });

    return response.data;
};