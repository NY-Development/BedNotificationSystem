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

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your email address',
      });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Password reset OTP sent to your email',
      });
      navigation.navigate('ResetPassword');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Failed to send reset email',
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
          <Ionicons name="lock-closed" size={80} color="#4F46E5" />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a password reset code
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, loading && styles.sendButtonDisabled]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.sendButtonText}>
              {loading ? 'Sending...' : 'Send Reset Code'}
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
    marginBottom: 24,
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
  sendButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendButtonText: {
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