// File: src/features/fields/screens/CreateReservationScreen.jsx
import React, { useState } from 'react';
import { View, Alert, StyleSheet, Text } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import useReservations from '../../reservations/hooks/useReservations';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function CreateReservationScreen({ route, navigation }) {
  const field = route.params?.field || {};
  const { createReservation, loading, error } = useReservations();
  const { control, handleSubmit } = useForm({ defaultValues: { date: '', time: '' } });
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      await createReservation({
        fieldId: field.id,
        date: values.date,
        time: values.time
      });
      Alert.alert('Reserva creada', 'Tu reserva se ha agendado correctamente.');
      navigation.goBack();
    } catch (err) {
      // error handled by hook
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Cancha: {field.name}</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="date"
        rules={{ required: 'Fecha es obligatoria' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Fecha" value={value} onChangeText={onChange} placeholder="YYYY-MM-DD" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="time"
        rules={{ required: 'Horario es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Horario" value={value} onChangeText={onChange} placeholder="HH:MM" error={fieldError?.message} />
        )}
      />
      <Button title="Crear reserva" onPress={handleSubmit(onSubmit)} loading={loading || submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  subtitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.sm
  }
});
