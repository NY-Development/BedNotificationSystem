import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function ResetPasswordScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword, userEmail } = useAuth();

  const handleResetPassword = async () => {
    if (!otp || !newPassword) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Password must be at least 6 characters',
      });
      return;
    }

    setLoading(true);
    try {
      await resetPassword(userEmail, otp, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset successfully!',
      });
      navigation.navigate('Login');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Password reset failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="key" size={80} color="#4F46E5" />
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter the OTP sent to your email and your new password
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Ionicons 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#6B7280" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#1F2937',
  },
  eyeIcon: {
    padding: 4,
  },
  resetButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  resetButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});