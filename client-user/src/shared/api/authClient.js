// File: src/shared/api/authClient.js
import axios from 'axios';
import { ENDPOINTS } from '../constants/endpoints';
import useAuthStore from '../store/authStore';
import * as SecureStore from 'expo-secure-store';

const instance = axios.create({ baseURL: ENDPOINTS.AUTH });

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

instance.interceptors.request.use((config) => {
  try {
    const token = useAuthStore.getState().token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (e) {}
  return config;
});

instance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response ? error.response.status : null;

    const excluded = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email', '/resend-verification'];
    if (status === 401 && !originalRequest._retry) {
      if (excluded.some((p) => originalRequest.url?.includes(p))) return Promise.reject(error);

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = 'Bearer ' + token;
            return axios(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync('refreshToken');
        const resp = await axios.post(`${ENDPOINTS.AUTH}/refresh`, { refreshToken });
        const newAccessToken = resp.data?.accessToken;
        const newRefreshToken = resp.data?.refreshToken;
        if (newAccessToken) useAuthStore.getState().setAccessToken(newAccessToken);
        if (newRefreshToken) await SecureStore.setItemAsync('refreshToken', newRefreshToken);
        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
        return axios(originalRequest);
      } catch (err) {
        processQueue(err, null);
        try {
          await useAuthStore.getState().logout();
        } catch (e) {}
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
