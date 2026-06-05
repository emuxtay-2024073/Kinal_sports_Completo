// File: src/features/auth/screens/LoginScreen.jsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function LoginScreen({ navigation }) {
  const { control, handleSubmit } = useForm({
    defaultValues: { emailOrUsername: '', password: '' }
  });
  const { handleLogin, loading, error } = useAuth();

  const onSubmit = async (values) => {
    const success = await handleLogin(values);
    if (!success) return;
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/kinal_sports.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title}>Iniciar sesión</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="emailOrUsername"
        rules={{ required: 'Correo o usuario es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input
            label="Correo o usuario"
            value={value}
            onChangeText={onChange}
            placeholder="Ingresa tu correo o usuario"
            error={fieldError?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Contraseña es obligatoria' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input
            label="Contraseña"
            value={value}
            onChangeText={onChange}
            placeholder="Ingresa tu contraseña"
            secureTextEntry
            error={fieldError?.message}
          />
        )}
      />
      <Button title="Entrar" onPress={handleSubmit(onSubmit)} loading={loading} />
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    backgroundColor: COLORS.background
  },
  logo: {
    width: '80%',
    height: 120,
    alignSelf: 'center',
    marginBottom: SPACING.lg
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  error: {
    marginBottom: SPACING.sm,
    color: COLORS.error,
    textAlign: 'center'
  },
  link: {
    marginTop: SPACING.md,
    alignItems: 'center'
  },
  linkText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm
  }
});
