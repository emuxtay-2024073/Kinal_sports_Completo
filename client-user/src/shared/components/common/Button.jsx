// File: src/shared/components/common/Button.jsx
import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function Button({ variant = 'primary', title, onPress, loading = false, style }) {
  const bg = variant === 'secondary' ? COLORS.secondary : COLORS.primary;
  const color = variant === 'secondary' ? '#fff' : '#fff';

  return (
    <Pressable style={[styles.button, { backgroundColor: bg }, style]} onPress={onPress} disabled={loading}>
      {loading ? <ActivityIndicator color={color} /> : <Text style={[styles.text, { color }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600'
  }
});
