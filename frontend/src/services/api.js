import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Attach JWT to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Expired or invalid token: clear session, send user to login
API.interceptors.response.use(
    (res) => res,
    (error) => {
        const hadToken = !!localStorage.getItem("token");
        if (error.response?.status === 401 && hadToken) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.assign("/login");
        }
        return Promise.reject(error);
    }
);

export default API;
