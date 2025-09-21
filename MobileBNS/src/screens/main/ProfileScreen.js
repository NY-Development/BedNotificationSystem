import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  const profileItems = [
    {
      title: 'Personal Information',
      items: [
        { label: 'Name', value: user?.name },
        { label: 'Email', value: user?.email },
        { label: 'Role', value: user?.role?.toUpperCase() },
        { label: 'Account Status', value: user?.isAccountVerified ? 'Verified' : 'Unverified' },
      ],
    },
    {
      title: 'Subscription',
      items: [
        { label: 'Plan', value: user?.subscription?.plan },
        { label: 'Status', value: user?.subscription?.isActive ? 'Active' : 'Inactive' },
        { 
          label: 'Start Date', 
          value: user?.subscription?.startDate 
            ? new Date(user.subscription.startDate).toLocaleDateString() 
            : 'N/A' 
        },
        { 
          label: 'End Date', 
          value: user?.subscription?.endDate 
            ? new Date(user.subscription.endDate).toLocaleDateString() 
            : 'N/A' 
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={60} color="#4F46E5" />
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      {profileItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.infoRow}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value || 'N/A'}</Text>
              </View>
            ))}
          </View>
        </View>
      ))}

      {user?.role === 'admin' && (
        <TouchableOpacity
          style={styles.adminButton}
          onPress={() => navigation.navigate('Admin')}
        >
          <Ionicons name="settings" size={20} color="white" />
          <Text style={styles.adminButtonText}>Admin Panel</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#DC2626" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginTop: 24,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
    textAlign: 'right',
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  adminButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});