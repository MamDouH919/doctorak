// import { handleLogout } from "@/actions/cookies";
import { removeToken } from "@/action/token";
import axios from "axios";
import { toast } from "sonner";

// Create Axios instance with credentials enabled for cookies
const api = axios.create({
    baseURL: "",
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
});

// Function to set or remove Authorization token dynamically (if needed)
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers["x-admin-access-token"] = token;
    } else {
        delete api.defaults.headers["x-admin-access-token"];
    }
};

// ✅ Response interceptor to catch 401 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            toast.error("Session expired. You've been logged out.");
            removeToken()
        }

        // Always return the error so it can be caught in catch()
        return Promise.reject(error);
    }
);

export default api;
