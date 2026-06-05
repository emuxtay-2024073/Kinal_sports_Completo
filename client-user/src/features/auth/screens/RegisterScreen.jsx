// File: src/features/auth/screens/RegisterScreen.jsx
import React from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import useAuth from '../hooks/useAuth';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, SPACING, FONT_SIZE } from '../../../shared/constants/theme';

export default function RegisterScreen({ navigation }) {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      surname: '',
      username: '',
      email: '',
      password: '',
      phone: ''
    }
  });

  const { handleRegister, loading, error } = useAuth();

  const onSubmit = async (values) => {
    const success = await handleRegister(values);
    if (success) {
      Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.');
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Registro</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Nombre es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Nombre" value={value} onChangeText={onChange} placeholder="Ingresa tu nombre" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="surname"
        rules={{ required: 'Apellido es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Apellido" value={value} onChangeText={onChange} placeholder="Ingresa tu apellido" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="username"
        rules={{ required: 'Usuario es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Usuario" value={value} onChangeText={onChange} placeholder="Ingresa tu usuario" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{ required: 'Correo es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Correo" value={value} onChangeText={onChange} placeholder="Ingresa tu correo" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: 'Contraseña es obligatoria' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Contraseña" value={value} onChangeText={onChange} placeholder="Ingresa tu contraseña" secureTextEntry error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="phone"
        rules={{ required: 'Teléfono es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Teléfono" value={value} onChangeText={onChange} placeholder="Ingresa tu teléfono" error={fieldError?.message} />
        )}
      />
      <Button title="Registrar" onPress={handleSubmit(onSubmit)} loading={loading} />
      <Text style={styles.footerText} onPress={() => navigation.navigate('Login')}>
        ¿Ya tienes cuenta? Inicia sesión
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    justifyContent: 'center'
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
  footerText: {
    marginTop: SPACING.md,
    textAlign: 'center',
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm
  }
});
