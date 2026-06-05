// File: src/features/teams/screens/TeamDetailScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import useTeams from '../hooks/useTeams';
import { Card } from '../../../shared/components/common/Common';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function TeamDetailScreen({ route }) {
  const team = route.params?.team || {};
  const { joinTeam, leaveTeam, loading, error } = useTeams();
  const isMember = Boolean(team.isMember || team.member || team.joined);

  const handleAction = async () => {
    try {
      if (isMember) {
        await leaveTeam(team._id || team.id);
        Alert.alert('Equipo actualizado', 'Has salido del equipo.');
      } else {
        await joinTeam(team._id || team.id);
        Alert.alert('Equipo actualizado', 'Te has unido al equipo.');
      }
    } catch (_) {
      Alert.alert('Error', error || 'No se pudo actualizar tu equipo');
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>{team.name || team.teamName || 'Detalle de equipo'}</Text>
        <Text style={styles.text}>{team.description || 'Descripción no disponible'}</Text>
        <Text style={styles.text}>Miembros: {team.membersCount || team.memberCount || 'N/A'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </Card>
      <Button
        title={isMember ? 'Salir del equipo' : 'Unirse al equipo'}
        onPress={handleAction}
        loading={loading}
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
    color: COLORS.textLight,
    marginBottom: SPACING.sm
  },
  error: {
    color: COLORS.error,
    marginTop: SPACING.sm
  }
});
