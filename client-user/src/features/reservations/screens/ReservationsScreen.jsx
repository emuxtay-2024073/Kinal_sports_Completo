// File: src/features/reservations/screens/ReservationsScreen.jsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import useReservations from '../hooks/useReservations';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function ReservationsScreen() {
  const { reservations, loading, error, refresh, cancelReservation } = useReservations();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.field.name}</Text>
      <Text style={styles.text}>Estado: {item.normalizedStatus}</Text>
      {item.date ? <Text style={styles.text}>Fecha: {item.date}</Text> : null}
      {item.time ? <Text style={styles.text}>Horario: {item.time}</Text> : null}
      {item.normalizedStatus !== 'CANCELLED' ? (
        <Button
          title="Cancelar"
          onPress={() => cancelReservation(item.id)}
          style={styles.button}
        />
      ) : null}
    </Card>
  );

  if (loading && reservations.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && reservations.length === 0) {
    return <EmptyState title="No se pudo cargar el historial" subtitle={error} />;
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id?.toString() || item.field.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      onRefresh={refresh}
      refreshing={loading}
      ListEmptyComponent={<EmptyState title="No hay reservas" subtitle="Crea una nueva reserva para comenzar." />}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  list: {
    padding: SPACING.md,
    backgroundColor: COLORS.background
  },
  card: {
    marginBottom: SPACING.md
  },
  title: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs
  },
  text: {
    color: COLORS.textLight,
    marginBottom: SPACING.xs
  },
  button: {
    marginTop: SPACING.sm
  }
});
