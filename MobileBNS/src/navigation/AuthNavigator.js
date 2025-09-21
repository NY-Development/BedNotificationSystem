import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerifyOTPScreen from '../screens/auth/VerifyOTPScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import PaymentScreen from '../screens/auth/PaymentScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4F46E5',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ title: 'Sign In' }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen 
        name="VerifyOTP" 
        component={VerifyOTPScreen}
        options={{ title: 'Verify Account' }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      <Stack.Screen 
        name="ResetPassword" 
        component={ResetPasswordScreen}
        options={{ title: 'New Password' }}
      />
      <Stack.Screen 
        name="Payment" 
        component={PaymentScreen}
        options={{ title: 'Complete Payment' }}
      />
    </Stack.Navigator>
  );
}