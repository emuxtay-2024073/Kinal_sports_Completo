// File: src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import authClient from '../../../shared/api/authClient';
import useAuthStore from '../../../shared/store/authStore';

export default function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loginStore = useAuthStore((state) => state.login);
  const logoutStore = useAuthStore((state) => state.logout);

  const normalizeResponse = (data) => {
    const accessToken = data?.accessToken || data?.token || data?.access_token || data?.data?.accessToken || data?.data?.token;
    const refreshToken = data?.refreshToken || data?.refresh_token || data?.data?.refreshToken || data?.data?.refresh_token;
    const user = data?.userDetails || data?.user || data?.data?.userDetails || data?.data?.user;
    return { accessToken, refreshToken, user };
  };

  const handleLogin = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authClient.post('/login', payload);
      const { accessToken, refreshToken, user } = normalizeResponse(response.data);
      if (!accessToken) throw new Error('No se recibió accessToken');

      await loginStore(accessToken, user, refreshToken);
      return true;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Error en el inicio de sesión';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [loginStore]);

  const handleRegister = useCallback(async (payload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authClient.post('/register', payload);
      if (response.status !== 201 && response.status !== 200) {
        throw new Error('No se pudo registrar');
      }
      return true;
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || 'Error en el registro';
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await logoutStore();
  }, [logoutStore]);

  return {
    handleLogin,
    handleRegister,
    loading,
    error,
    logout
  };
}
