import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-toast-message';

import { AuthProvider } from './src/context/AuthContext';
import { BedProvider } from './src/context/BedContext';
import { AssignmentProvider } from './src/context/AssignmentContext';
import { AdminProvider } from './src/context/AdminContext';

import AuthNavigator from './src/navigation/AuthNavigator';
import MainNavigator from './src/navigation/MainNavigator';
import { useAuth } from './src/context/AuthContext';

const Stack = createStackNavigator();

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <NavigationContainer>
      {user && user.subscription?.isActive ? (
        <MainNavigator />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BedProvider>
        <AssignmentProvider>
          <AdminProvider>
            <AppContent />
            <StatusBar style="auto" />
            <Toast />
          </AdminProvider>
        </AssignmentProvider>
      </BedProvider>
    </AuthProvider>
  );
}