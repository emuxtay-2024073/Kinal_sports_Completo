// File: src/features/fields/screens/FieldsScreen.jsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import useFields from '../hooks/useFields';
import { Card, EmptyState } from '../../../shared/components/common/Common';
import { LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function FieldsScreen({ navigation }) {
  const { fields, loading, error, refresh } = useFields();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('FieldDetail', { field: item })}>
      <Card style={styles.card}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.location}</Text>
        <Text style={[styles.status, { color: item.isAvailable ? COLORS.success : COLORS.error }]}> 
          {item.isAvailable ? 'Disponible' : 'No disponible'}
        </Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading && fields.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && fields.length === 0) {
    return <EmptyState title="No se pudieron cargar las canchas" subtitle={error} />;
  }

  return (
    <FlatList
      data={fields}
      keyExtractor={(item) => item.id?.toString() || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="No hay canchas disponibles" subtitle="Intenta actualizar más tarde." />}
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
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text
  },
  meta: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight,
    marginTop: SPACING.xs
  },
  status: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600'
  }
});
