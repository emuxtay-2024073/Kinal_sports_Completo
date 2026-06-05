// File: src/features/reservations/hooks/useReservations.js
import { useState, useEffect, useCallback } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.get('/reservations/me/history');
      const data = response.data.data || response.data;
      const items = (Array.isArray(data) ? data : []).map((reservation) => ({
        id: reservation._id || reservation.id,
        field: {
          id: reservation.field?.id || reservation.field?._id,
          name: reservation.field?.name || reservation.field?.fieldName,
          image: reservation.field?.image || reservation.field?.photo
        },
        normalizedStatus: (reservation.status || '').toUpperCase(),
        date: reservation.date || reservation.createdAt || null,
        time: reservation.time || null
      }));
      setReservations(items);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReservation = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.post('/reservations', payload);
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelReservation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await userClient.put(`/reservations/${id}/cancel`);
      await fetchReservations();
      return response.data.data || response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cancelar reserva');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchReservations]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return {
    reservations,
    loading,
    error,
    refresh: fetchReservations,
    createReservation,
    cancelReservation
  };
}
