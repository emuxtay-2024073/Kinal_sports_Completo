// File: src/navigation/MainTabs.jsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING } from '../shared/constants/theme';
import FieldsScreen from '../features/fields/screens/FieldsScreen';
import FieldDetailScreen from '../features/fields/screens/FieldDetailScreen';
import CreateReservationFieldScreen from '../features/fields/screens/CreateReservationScreen';
import ReservationsScreen from '../features/reservations/screens/ReservationsScreen';
import TeamsScreen from '../features/teams/screens/TeamsScreen';
import TeamDetailScreen from '../features/teams/screens/TeamDetailScreen';
import MyTeamsScreen from '../features/teams/screens/MyTeamsScreen';
import CreateTeamScreen from '../features/teams/screens/CreateTeamScreen';
import TournamentsScreen from '../features/tournaments/screens/TournamentsScreen';
import TournamentDetailScreen from '../features/tournaments/screens/TournamentDetailScreen';
import MyTournamentsScreen from '../features/tournaments/screens/MyTournamentsScreen';
import ProfileScreen from '../features/profile/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function FieldsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="FieldsList" component={FieldsScreen} options={{ title: 'Campos' }} />
      <Stack.Screen name="FieldDetail" component={FieldDetailScreen} options={{ title: 'Detalle de campo' }} />
      <Stack.Screen name="CreateReservation" component={CreateReservationFieldScreen} options={{ title: 'Reservar cancha' }} />
    </Stack.Navigator>
  );
}

function TeamsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="TeamsList" component={TeamsScreen} options={{ title: 'Equipos' }} />
      <Stack.Screen name="TeamDetail" component={TeamDetailScreen} options={{ title: 'Detalle de equipo' }} />
      <Stack.Screen name="MyTeams" component={MyTeamsScreen} options={{ title: 'Mis equipos' }} />
      <Stack.Screen name="CreateTeam" component={CreateTeamScreen} options={{ title: 'Crear equipo' }} />
    </Stack.Navigator>
  );
}

function TournamentsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="TournamentsList" component={TournamentsScreen} options={{ title: 'Torneos' }} />
      <Stack.Screen name="TournamentDetail" component={TournamentDetailScreen} options={{ title: 'Detalle de torneo' }} />
      <Stack.Screen name="MyTournaments" component={MyTournamentsScreen} options={{ title: 'Mis torneos' }} />
    </Stack.Navigator>
  );
}

function ReservationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ReservationsList" component={ReservationsScreen} options={{ title: 'Reservas' }} />
    </Stack.Navigator>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: route.name === 'Profile',
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          height: 60,
          borderTopColor: COLORS.border
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = 'sports-soccer';

          switch (route.name) {
            case 'Fields':
              iconName = 'sports-soccer';
              break;
            case 'Teams':
              iconName = 'groups';
              break;
            case 'Tournaments':
              iconName = 'emoji-events';
              break;
            case 'Reservations':
              iconName = 'event';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'sports-soccer';
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Fields" component={FieldsStack} options={{ title: 'Campos' }} />
      <Tab.Screen name="Teams" component={TeamsStack} options={{ title: 'Equipos' }} />
      <Tab.Screen name="Tournaments" component={TournamentsStack} options={{ title: 'Torneos' }} />
      <Tab.Screen name="Reservations" component={ReservationsStack} options={{ title: 'Reservas' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
}
