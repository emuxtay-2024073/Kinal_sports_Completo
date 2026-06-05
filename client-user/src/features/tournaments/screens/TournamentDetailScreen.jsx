// File: src/features/tournaments/screens/TournamentDetailScreen.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import useTournaments from '../hooks/useTournaments';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { Card } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function TournamentDetailScreen({ route }) {
  const tournament = route.params?.tournament || {};
  const { registerTeam, loading, error } = useTournaments();
  const { control, handleSubmit } = useForm({ defaultValues: { teamId: '' } });

  const onSubmit = async (values) => {
    try {
      await registerTeam(tournament._id || tournament.id, values.teamId);
      Alert.alert('Inscripción exitosa', 'Tu equipo fue inscrito en el torneo.');
    } catch (_) {
      Alert.alert('Error', error || 'No se pudo inscribir el equipo.');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{tournament.name || 'Detalle de torneo'}</Text>
        <Text style={styles.text}>{tournament.description || 'Descripción no disponible'}</Text>
        <Text style={styles.text}>{tournament.location || 'Ubicación no disponible'}</Text>
      </Card>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="teamId"
        rules={{ required: 'ID de equipo es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="ID del equipo" value={value} onChangeText={onChange} placeholder="Ingrese ID del equipo" error={fieldError?.message} />
        )}
      />
      <Button title="Inscribir equipo" onPress={handleSubmit(onSubmit)} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  card: {
    marginBottom: SPACING.lg
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm
  },
  text: {
    color: COLORS.textLight,
    marginBottom: SPACING.sm
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.sm
  }
});
