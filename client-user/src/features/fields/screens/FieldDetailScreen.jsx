// File: src/features/fields/screens/FieldDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function FieldDetailScreen({ route, navigation }) {
  const field = route.params?.field || {};

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{field.name || 'Detalle de cancha'}</Text>
        <Text style={styles.text}>{field.location}</Text>
        <Text style={[styles.status, { color: field.isAvailable ? COLORS.success : COLORS.error }]}> 
          {field.isAvailable ? 'Disponible' : 'No disponible'}
        </Text>
      </Card>
      <Button
        title="Reservar cancha"
        onPress={() => navigation.navigate('CreateReservation', { field })}
        style={styles.button}
      />
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
    fontSize: FONT_SIZE.md,
    color: COLORS.textLight,
    marginBottom: SPACING.md
  },
  status: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600'
  },
  button: {
    marginTop: SPACING.md
  }
});
