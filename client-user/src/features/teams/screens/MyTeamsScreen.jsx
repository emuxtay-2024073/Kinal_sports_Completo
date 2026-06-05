// File: src/features/teams/screens/MyTeamsScreen.jsx
import React from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import useTeams from '../hooks/useTeams';
import { Card, EmptyState, LoadingSpinner } from '../../../shared/components/common/Common';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function MyTeamsScreen({ navigation }) {
  const { myTeams, loading, error, refreshMyTeams } = useTeams();

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Text style={styles.title}>{item.name || item.teamName || 'Equipo'}</Text>
      <Text style={styles.text}>{item.description || 'Sin descripción'}</Text>
      <Text style={styles.status}>Miembro</Text>
    </Card>
  );

  if (loading && myTeams.length === 0) {
    return (
      <View style={styles.center}>
        <LoadingSpinner />
      </View>
    );
  }

  if (error && myTeams.length === 0) {
    return <EmptyState title="No se pudieron cargar tus equipos" subtitle={error} />;
  }

  return (
    <FlatList
      data={myTeams}
      keyExtractor={(item) => item._id?.toString() || item.id || item.name}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={refreshMyTeams} tintColor={COLORS.primary} />}
      ListEmptyComponent={<EmptyState title="No tienes equipos" subtitle="Crea uno o únete a uno." />}
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
    color: COLORS.textLight,
    marginBottom: SPACING.xs
  },
  status: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.primary
  }
});
