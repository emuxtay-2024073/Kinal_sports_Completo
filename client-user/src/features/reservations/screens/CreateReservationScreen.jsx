// File: src/features/reservations/screens/CreateReservationScreen.jsx
import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import useReservations from '../hooks/useReservations';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function CreateReservationScreen({ navigation }) {
  const { createReservation, loading, error } = useReservations();
  const { control, handleSubmit } = useForm({ defaultValues: { fieldId: '', date: '', time: '' } });

  const onSubmit = async (values) => {
    try {
      await createReservation(values);
      Alert.alert('Reserva creada', 'La reserva fue registrada con éxito');
      navigation.goBack();
    } catch (_) {
      // Error already establecido en el hook.
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>Crear reserva</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="fieldId"
        rules={{ required: 'ID de cancha es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="ID de cancha" value={value} onChangeText={onChange} placeholder="Ingrese el ID de la cancha" error={fieldError?.message} />
        )}
      />
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
      <Button title="Crear reserva" onPress={handleSubmit(onSubmit)} loading={loading} />
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
