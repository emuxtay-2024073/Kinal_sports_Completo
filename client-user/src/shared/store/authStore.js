// File: src/shared/store/authStore.js
import create from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (accessToken, user, refreshToken) => {
        try {
          if (refreshToken) await SecureStore.setItemAsync('refreshToken', refreshToken);
        } catch (e) {}
        set({ token: accessToken, user, isAuthenticated: !!accessToken });
      },

      logout: async () => {
        try {
          await SecureStore.deleteItemAsync('refreshToken');
        } catch (e) {}
        set({ token: null, user: null, isAuthenticated: false });
      },

      setAccessToken: (accessToken) => set({ token: accessToken, isAuthenticated: !!accessToken }),

      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage,
      onRehydrateStorage: () => (state) => {
        // cuando termina la rehidratación marcamos hydrated
        setTimeout(() => {
          try {
            // acceder al estado para forzar _hasHydrated true
            const s = useAuthStore.getState();
            useAuthStore.setState({ ...s, _hasHydrated: true });
          } catch (e) {}
        }, 0);
      },
    }
  )
);

export default useAuthStore;
