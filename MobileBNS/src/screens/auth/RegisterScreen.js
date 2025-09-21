import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'c1',
    plan: 'monthly',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all fields',
      });
      return;
    }

    setLoading(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
        formData.role,
        formData.plan
      );
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Registration successful! Check your email for OTP.',
      });
      navigation.navigate('VerifyOTP');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Ionicons name="medical" size={60} color="#4F46E5" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Hospital BNS today</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
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

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Role</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => updateFormData('role', value)}
                style={styles.picker}
              >
                <Picker.Item label="C1 Student" value="c1" />
                <Picker.Item label="C2 Student" value="c2" />
                <Picker.Item label="Intern" value="intern" />
              </Picker>
            </View>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Subscription Plan</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.plan}
                onValueChange={(value) => updateFormData('plan', value)}
                style={styles.picker}
              >
                <Picker.Item label="Monthly (100 ETB)" value="monthly" />
                <Picker.Item label="Yearly (1000 ETB - Save 20%)" value="yearly" />
              </Picker>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
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
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  picker: {
    height: 48,
  },
  registerButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  registerButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: '#6B7280',
    fontSize: 14,
  },
  loginLink: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '600',
  },
});