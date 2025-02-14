import axios from "axios";
import { useMemo } from "react";

export default function useInstance() {
  const instance = useMemo(() => {
    const axiosInstance = axios.create({
      baseURL: import.meta.env.VITE_API_APIURL,
    });

    axiosInstance.interceptors.request.use(
      (config) => {
        const accessToken = localStorage.getItem("_auth");
        if (accessToken) {
          if (config.headers)
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        switch (error.response.status) {
          case 422:
            break;

          case 500:
            break;

          default:
            break;
        }
        return Promise.reject(error);
      }
    );

    return axiosInstance;
  }, []);

  return {
    instance,
  };
}
