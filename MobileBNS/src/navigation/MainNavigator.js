import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/main/DashboardScreen';
import BedsScreen from '../screens/main/BedsScreen';
import NotificationsScreen from '../screens/main/NotificationsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import AdminScreen from '../screens/main/AdminScreen';
import AssignmentsScreen from '../screens/main/AssignmentsScreen';
import MyAssignmentsScreen from '../screens/main/MyAssignmentsScreen';

import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="DashboardMain" 
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="Assignments" 
        component={AssignmentsScreen}
        options={{ title: 'Bed Assignments' }}
      />
      <Stack.Screen 
        name="MyAssignments" 
        component={MyAssignmentsScreen}
        options={{ title: 'My Assignments' }}
      />
    </Stack.Navigator>
  );
}

function ProfileStack() {
  const { user } = useAuth();
  
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ProfileMain" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      {user?.role === 'admin' && (
        <Stack.Screen 
          name="Admin" 
          component={AdminScreen}
          options={{ title: 'Admin Panel' }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Beds') {
            iconName = focused ? 'bed' : 'bed-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Beds" 
        component={BedsScreen}
        options={{ title: 'Bed Management' }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}