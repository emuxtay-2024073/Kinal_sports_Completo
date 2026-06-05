// File: src/features/teams/screens/CreateTeamScreen.jsx
import React, { useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import useTeams from '../hooks/useTeams';
import Input from '../../../shared/components/common/Input';
import Button from '../../../shared/components/common/Button';
import { COLORS, FONT_SIZE, SPACING } from '../../../shared/constants/theme';

export default function CreateTeamScreen({ navigation }) {
  const { createTeam, loading, error } = useTeams();
  const { control, handleSubmit } = useForm({ defaultValues: { name: '', description: '' } });
  const [imageUri, setImageUri] = useState(null);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos permiso para acceder a tu galería.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.cancelled) {
      setImageUri(result.assets?.[0]?.uri || result.uri);
    }
  };

  const onSubmit = async (values) => {
    try {
      await createTeam(values, imageUri);
      Alert.alert('Equipo creado', 'Tu equipo ha sido creado con éxito.');
      navigation.goBack();
    } catch (_) {
      // error mostrado por hook
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear equipo</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Nombre es obligatorio' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Nombre" value={value} onChangeText={onChange} placeholder="Nombre del equipo" error={fieldError?.message} />
        )}
      />
      <Controller
        control={control}
        name="description"
        rules={{ required: 'Descripción es obligatoria' }}
        render={({ field: { value, onChange }, fieldState: { error: fieldError } }) => (
          <Input label="Descripción" value={value} onChangeText={onChange} placeholder="Descripción del equipo" error={fieldError?.message} />
        )}
      />
      <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
        <Text style={styles.photoButtonText}>{imageUri ? 'Cambiar foto' : 'Seleccionar foto'}</Text>
      </TouchableOpacity>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.preview} /> : null}
      <Button title="Crear equipo" onPress={handleSubmit(onSubmit)} loading={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md
  },
  error: {
    color: COLORS.error,
    marginBottom: SPACING.sm
  },
  photoButton: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    alignItems: 'center',
    borderRadius: 8
  },
  photoButtonText: {
    color: COLORS.surface,
    fontSize: FONT_SIZE.sm,
    fontWeight: '600'
  },
  preview: {
    width: '100%',
    height: 160,
    marginBottom: SPACING.md,
    borderRadius: 8
  }
});
