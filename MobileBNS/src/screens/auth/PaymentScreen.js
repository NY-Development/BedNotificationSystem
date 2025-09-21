import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function PaymentScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { initiateUserPayment, userEmail } = useAuth();

  React.useEffect(() => {
    if (userEmail) {
      setEmail(userEmail);
    }
  }, [userEmail]);

  const handlePayment = async () => {
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
      const checkoutUrl = await initiateUserPayment(email);
      
      if (checkoutUrl) {
        Alert.alert(
          'Payment Required',
          'You will be redirected to complete your payment. After successful payment, return to the app and login.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Continue to Payment',
              onPress: () => {
                Linking.openURL(checkoutUrl);
                // Navigate back to login after opening payment
                setTimeout(() => {
                  navigation.navigate('Login');
                }, 1000);
              },
            },
          ]
        );
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Payment Error',
        text2: error.message || 'Failed to initiate payment',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="card" size={80} color="#4F46E5" />
          <Text style={styles.title}>Complete Payment</Text>
          <Text style={styles.subtitle}>
            Complete your subscription payment to access the app
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
            style={[styles.paymentButton, loading && styles.paymentButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            <Text style={styles.paymentButtonText}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              You will be redirected to a secure payment page. After successful payment, 
              return to the app and login with your credentials.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
  paymentButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  paymentButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  paymentButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#EFF6FF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    color: '#1E40AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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