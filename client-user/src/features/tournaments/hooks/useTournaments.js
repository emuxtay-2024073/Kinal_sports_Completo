// File: src/features/tournaments/hooks/useTournaments.js
import { useState, useEffect, useCallback } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useTournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [myTournaments, setMyTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments');
      const data = response.data.data || response.data;
      setTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyTournaments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/tournaments/my-tournaments');
      const data = response.data.data || response.data;
      setMyTournaments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar mis torneos');
    } finally {
      setLoading(false);
    }
  }, []);

  const registerTeam = useCallback(async (tournamentId, teamId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post(`/tournaments/register/${tournamentId}`, { teamId });
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al inscribir equipo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTournaments();
    fetchMyTournaments();
  }, [fetchTournaments, fetchMyTournaments]);

  return {
    tournaments,
    myTournaments,
    loading,
    error,
    refresh: fetchTournaments,
    refreshMyTournaments: fetchMyTournaments,
    registerTeam
  };
}
