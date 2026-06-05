// File: src/features/teams/screens/TeamsScreen.jsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import useTeams from '../hooks/useTeams';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function TeamsScreen({ navigation }) {
  const { teams, loading, error, refresh } = useTeams();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TeamDetail', { team: item })}>
      <Card style={styles.card}>
        <Text style={styles.title}>{item.name || item.teamName || 'Equipo'}</Text>
        <Text style={styles.text}>{item.description || 'Sin descripción disponible'}</Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading && teams.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && teams.length === 0) {
    return <EmptyState title="No se pudieron cargar los equipos" subtitle={error} />;
  }

  return (
    <FlatList
      data={teams}
      keyExtractor={(item) => item._id?.toString() || item.id || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="No hay equipos" subtitle="Crea o únete a un equipo." />}
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
    fontSize: FONT_SIZE.sm,
    color: COLORS.textLight
  }
});
