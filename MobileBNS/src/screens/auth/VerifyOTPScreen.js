import React, { useState, useEffect } from 'react';
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

export default function VerifyOTPScreen({ navigation }) {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { checkOtp, resendVerificationOtp, userEmail, initiateUserPayment } = useAuth();

  useEffect(() => {
    if (!userEmail) {
      navigation.navigate('Register');
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [userEmail, navigation]);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid 6-digit OTP',
      });
      return;
    }

    setLoading(true);
    try {
      await checkOtp(userEmail, otp);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account verified! Redirecting to payment...',
      });
      
      // Navigate to payment screen instead of initiating payment directly
      setTimeout(() => {
        navigation.navigate('Payment');
      }, 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: error || 'Invalid OTP',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await resendVerificationOtp(userEmail);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'New OTP sent to your email',
      });
      setTimer(60);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error || 'Failed to resend OTP',
      });
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="mail" size={80} color="#4F46E5" />
          <Text style={styles.title}>Verify Your Account</Text>
          <Text style={styles.subtitle}>
            Enter the 6-digit code sent to{'\n'}
            <Text style={styles.email}>{userEmail}</Text>
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.otpContainer}>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
              textAlign="center"
              fontSize={24}
              letterSpacing={8}
            />
          </View>

          <TouchableOpacity
            style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
            onPress={handleVerifyOTP}
            disabled={loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in {timer} seconds
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendOTP}>
                <Text style={styles.resendText}>Resend OTP</Text>
              </TouchableOpacity>
            )}
          </View>
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
  email: {
    fontWeight: '600',
    color: '#4F46E5',
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
  otpContainer: {
    marginBottom: 24,
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB',
    fontWeight: 'bold',
  },
  verifyButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  verifyButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
  },
  timerText: {
    color: '#6B7280',
    fontSize: 14,
  },
  resendText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});