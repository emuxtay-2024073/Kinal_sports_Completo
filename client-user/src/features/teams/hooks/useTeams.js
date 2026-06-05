// File: src/features/teams/hooks/useTeams.js
import { useState, useEffect, useCallback } from 'react';
import userClient from '../../../shared/api/userClient';
import useAuthStore from '../../../shared/store/authStore';

export default function useTeams() {
  const [teams, setTeams] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useAuthStore((state) => state.user);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/teams');
      const data = response.data.data || response.data;
      setTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar equipos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!user?._id) {
        setMyTeams([]);
        return;
      }
      const response = await userClient.get('/teams/me/mis-equipos');
      const data = response.data.data || response.data;
      setMyTeams(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar mis equipos');
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  const joinTeam = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post(`/teams/${id}/join`);
      await fetchMyTeams();
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al unirse al equipo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams]);

  const leaveTeam = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post(`/teams/${id}/leave`);
      await fetchMyTeams();
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al salir del equipo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyTeams]);

  const createTeam = useCallback(async (payload, imageUri) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
          formData.append(key, payload[key]);
        }
      });
      if (imageUri) {
        const filename = imageUri.split('/').pop();
        const match = filename?.match(/\.(\w+)$/);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        formData.append('photo', {
          uri: imageUri,
          name: filename,
          type
        });
      }
      const response = await userClient.post('/teams', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchTeams();
      await fetchMyTeams();
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear el equipo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTeams, fetchMyTeams]);

  useEffect(() => {
    fetchTeams();
    fetchMyTeams();
  }, [fetchTeams, fetchMyTeams]);

  return {
    teams,
    myTeams,
    loading,
    error,
    refresh: fetchTeams,
    refreshMyTeams: fetchMyTeams,
    joinTeam,
    leaveTeam,
    createTeam
  };
}
