// File: src/features/tournaments/screens/MyTournamentsScreen.jsx
import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import useTournaments from '../hooks/useTournaments';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function MyTournamentsScreen() {
  const { myTournaments, loading, error, refreshMyTournaments } = useTournaments();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.name || 'Torneo inscrito'}</Text>
      <Text style={styles.text}>{item.location || 'Ubicación no disponible'}</Text>
      <Text style={styles.status}>Inscrito</Text>
    </Card>
  );

  if (loading && myTournaments.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && myTournaments.length === 0) {
    return <EmptyState title="No se pudieron cargar tus torneos" subtitle={error} />;
  }

  return (
    <FlatList
      data={myTournaments}
      keyExtractor={(item) => item._id?.toString() || item.id || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMyTournaments} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="No tienes torneos" subtitle="Inscríbete en uno para verlo aquí." />}
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
  status: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary
  }
});
