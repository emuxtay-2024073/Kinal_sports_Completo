// File: src/shared/components/common/Input.jsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../../constants/theme';

export default function Input({ label, error, value, onChangeText, placeholder, secureTextEntry = false, editable = true }) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, error ? styles.inputError : null]}
        secureTextEntry={secureTextEntry}
        editable={editable}
        placeholderTextColor={COLORS.textLight}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: SPACING.md
  },
  label: {
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontSize: FONT_SIZE.sm
  },
  input: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    padding: SPACING.sm,
    borderRadius: 6,
    color: COLORS.text
  },
  inputError: {
    borderColor: COLORS.error
  },
  error: {
    color: COLORS.error,
    marginTop: SPACING.xs,
    fontSize: FONT_SIZE.xs
  }
});
