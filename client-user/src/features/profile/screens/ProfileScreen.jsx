// File: src/features/profile/screens/ProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import userClient from '../../../shared/api/userClient';
import useAuthStore from '../../../shared/store/authStore';
import { Card, EmptyState } from '../../../shared/components/common/Common';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

const DEFAULT_AVATAR = require('../../../../assets/avatarDefault.png');

export default function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profile, setProfile] = useState(null);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      displayName: '',
      phone: '',
      favoriteSports: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await userClient.get('/users/profile');
        const data = response.data.data || response.data;
        setProfile(data);
        reset({
          displayName: data.displayName || data.name || '',
          phone: data.phone || '',
          favoriteSports: Array.isArray(data.favoriteSports) ? data.favoriteSports.join(', ') : data.favoriteSports || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [reset]);

  const onSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        displayName: values.displayName,
        phone: values.phone,
        favoriteSports: values.favoriteSports
          .split(',')
          .map((sport) => sport.trim())
          .filter(Boolean)
      };
      const response = await userClient.put('/users/profile', payload);
      const data = response.data.data || response.data;
      setProfile(data);
      updateUser(data);
      reset({
        displayName: data.displayName || data.name || '',
        phone: data.phone || '',
        favoriteSports: Array.isArray(data.favoriteSports) ? data.favoriteSports.join(', ') : data.favoriteSports || ''
      });
      setEditMode(false);
      Alert.alert('Perfil actualizado', 'Tus datos se guardaron correctamente.');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al actualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que deseas cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: () => logout() }
    ]);
  };

  const avatarSource = profile?.avatar?.startsWith('http') ? { uri: profile.avatar } : DEFAULT_AVATAR;

  return (
    <View style={styles.container}>
      {error && !profile ? (
        <EmptyState title="Perfil" subtitle={error} />
      ) : (
        <Card style={styles.card}>
          <Image source={avatarSource} style={styles.avatar} />
          <Text style={styles.name}>{profile?.displayName || profile?.name || 'Usuario'}</Text>
          <Text style={styles.info}>{profile?.email || 'Correo no disponible'}</Text>
          <Button
            title={editMode ? 'Cancelar edición' : 'Editar perfil'}
            onPress={() => setEditMode((prev) => !prev)}
            style={styles.editButton}
          />
          <View style={styles.divider} />
          <Controller
            control={control}
            name="displayName"
            render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
              <Input
                label="Nombre a mostrar"
                value={value}
                onChangeText={onChange}
                placeholder="Nombre completo"
                error={fieldError?.message}
                editable={editMode}
              />
            )}
          />
          <Controller
            control={control}
            name="phone"
            render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
              <Input
                label="Teléfono"
                value={value}
                onChangeText={onChange}
                placeholder="Número de contacto"
                error={fieldError?.message}
                editable={editMode}
              />
            )}
          />
          <Controller
            control={control}
            name="favoriteSports"
            render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
              <Input
                label="Deportes favoritos"
                value={value}
                onChangeText={onChange}
                placeholder="Fútbol, vóley, baloncesto"
                error={fieldError?.message}
                editable={editMode}
              />
            )}
          />
          {editMode ? (
            <Button
              title="Guardar cambios"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              style={styles.saveButton}
            />
          ) : null}
          <Button title="Cerrar sesión" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
        </Card>
      )}
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
    padding: SPACING.md
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: SPACING.md
  },
  name: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center'
  },
  info: {
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md
  },
  editButton: {
    marginVertical: SPACING.sm
  },
  saveButton: {
    marginBottom: SPACING.sm
  },
  logoutButton: {
    marginTop: SPACING.sm
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md
  }
});
