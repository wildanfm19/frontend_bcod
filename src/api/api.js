import axios from "axios";

const api = axios.create({
  baseURL: "https://api-bettabeal.dgeo.id/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;