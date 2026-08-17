import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

if (import.meta.env.DEV) {
  console.log("API Base URL:", baseURL);
}

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token from storage on authorization failure
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;
