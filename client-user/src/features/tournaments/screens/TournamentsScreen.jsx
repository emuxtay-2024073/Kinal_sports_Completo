// File: src/features/tournaments/screens/TournamentsScreen.jsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, StyleSheet } from 'react-native';
import useTournaments from '../hooks/useTournaments';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function TournamentsScreen({ navigation }) {
  const { tournaments, loading, error, refresh } = useTournaments();

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('TournamentDetail', { tournament: item })}>
      <Card style={styles.card}>
        <Text style={styles.title}>{item.name || 'Torneo'}</Text>
        <Text style={styles.text}>{item.location || item.city || 'Ubicación no disponible'}</Text>
      </Card>
    </TouchableOpacity>
  );

  if (loading && tournaments.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && tournaments.length === 0) {
    return <EmptyState title="No se pudieron cargar los torneos" subtitle={error} />;
  }

  return (
    <FlatList
      data={tournaments}
      keyExtractor={(item) => item._id?.toString() || item.id || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="No hay torneos" subtitle="Vuelve más tarde para nuevas inscripciones." />}
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
