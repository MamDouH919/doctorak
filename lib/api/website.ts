import api from "../api";

interface DoctorData {
    doctor: {
        _id: string;
        siteName: { ar: string; en: string };
        title: { ar: string; en: string };
        description: { ar: string; en: string };
        about: { ar: string; en: string };
        specialization: {
            name: { en: string; ar: string };
        };
        user: {
            name: { ar: string; en: string };
        };
        clinics: Array<{
            name: { ar: string; en: string };
            address: { ar: string; en: string };
            phone: string;
            mobile: string;
            governorate: { name: { en: string; ar: string } };
            city: { name: { en: string; ar: string } };
            appointments: Array<{
                day: string;
                timeFrom: string;
                timeTo: string;
            }>;
        }>;
        faqs: Array<{
            question: { ar: string; en: string };
            answer: { ar: string; en: string };
        }>;
        articles: Array<{
            title: { ar: string; en: string };
            content: { ar: string; en: string };
        }>;
        videos: Array<{
            link: string;
            type: string;
        }>;
        social: Array<{
            type: string;
            link: string;
        }>;
        color: string;
        phone: string;
        whatsApp: string;
        services: {
            ar: string[];
            en: string[];
        };
        image: {
            url: string;
            alt: string;
        },
        domain: string
    };
}

//  get specializations
export interface Specialization {
    _id: string;
    slug: string;
    name: {
        ar: string;
        en: string;
    };
    // Add more fields as needed
}

export interface Doctors {
    _id: string;
    domain: string;
    visitors: number;
    description: {
        ar: string;
        en: string;
    };
    image: {
        url: string;
        alt: string;
    }
    specialization: {
        name: {
            ar: string;
            en: string;
        };
        slug: string;
    }
    siteName: string;
    user: {
        _id: string;
        name: {
            ar: string;
            en: string;
        };
    }
    governorates: {
        _id: string;
        name: {
            ar: string;
            en: string
        }
    }[];
    cities: {
        _id: string;
        name: {
            ar: string;
            en: string
        }
    }[];
    // Add more fields as needed
}

interface FetchParams {
    limit?: number;
}

interface FetchAccountsParams {
    showInHomePage?: boolean;
    name?: string;
    specialty?: string;
    governorate?: string;
    city?: string;
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
        governorate: undefined,
        city: undefined,
    }
): Promise<{
    data: Doctors[];
}> => {
    const queryParams = new URLSearchParams();
    if (params.showInHomePage !== undefined) queryParams.append('showInHomePage', String(params.showInHomePage));
    if (params.name) queryParams.append('name', params.name);
    if (params.specialty) queryParams.append('specialty', params.specialty);
    if (params.governorate) queryParams.append('governorate', params.governorate);
    if (params.city) queryParams.append('city', params.city);

    const response = await api.get(`/api/website/doctors?${queryParams.toString()}`);

    return response.data;
};

export const getDoctorById = async (
    id: string
): Promise<{
    data: DoctorData;
}> => {
    const response = await api.get(`/api/website/doctors/${id}`);

    return response.data;
};

export const getDoctorSEOById = async (
    id: string
): Promise<{
    data: DoctorData;
}> => {
    const response = await api.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/website/doctors/${id}`);

    return response.data;
};


export const getAllDoctorsIds = async (): Promise<{ id: string }[]> => {
    const response = await api.get('/api/website/doctors/all-ids');
    return response.data;
};