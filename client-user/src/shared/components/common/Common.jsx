// File: src/shared/components/common/Common.jsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, SHADOWS } from '../../constants/theme';

export function LoadingSpinner({ size = 'small', color = COLORS.primary }) {
  return <ActivityIndicator size={size} color={color} />;
}

export function EmptyState({ title = 'Sin datos', subtitle }) {
  return (
    <View style={styles.empty}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    padding: SPACING.lg
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: '600'
  },
  subtitle: {
    color: COLORS.textLight,
    marginTop: SPACING.xs
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm
  }
});
