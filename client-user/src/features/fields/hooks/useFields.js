// File: src/features/fields/hooks/useFields.js
import { useState, useEffect, useCallback } from 'react';
import userClient from '../../../shared/api/userClient';

export default function useFields() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await userClient.get('/fields');
      const data = response.data.data || response.data;
      const items = (Array.isArray(data) ? data : []).map((field) => ({
        id: field._id || field.id,
        name: field.fieldName || field.name,
        image: field.photo || null,
        location: `${field.fieldType || field.type || ''} • ${field.capacity || ''}`,
        isAvailable: Boolean(field.isActive)
      }));
      setFields(items);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al cargar las canchas');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    fields,
    loading,
    error,
    refresh: fetchFields
  };
}
