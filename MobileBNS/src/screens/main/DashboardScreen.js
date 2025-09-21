import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAssignment } from '../../context/AssignmentContext';
import AssignmentsScreen from './AssignmentsScreen';

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const { expiry, deptExpiry, wardExpiry, loading, fetchExpiry } = useAssignment();
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [forceRequired, setForceRequired] = useState(false);

  const hasExpiredAssignment = React.useMemo(() => {
    if (!expiry) return false;
    const today = new Date().toLocaleDateString('en-CA');
    const deptExpired = deptExpiry && today >= deptExpiry;
    const wardExpired = wardExpiry && today >= wardExpiry;
    return deptExpired || wardExpired;
  }, [expiry, deptExpiry, wardExpiry]);

  useEffect(() => {
    if (!loading && user) {
      const isFirstLogin = !user.firstLoginDone;
      if (isFirstLogin || hasExpiredAssignment) {
        setShowAssignmentModal(true);
        setForceRequired(true);
      } else {
        setForceRequired(false);
      }
    }
  }, [loading, user, hasExpiredAssignment]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user) fetchExpiry();
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, [user, fetchExpiry]);

  const dashboardItems = [
    {
      title: 'Manage Beds',
      subtitle: 'Browse and assign beds',
      icon: 'bed-outline',
      color: '#10B981',
      onPress: () => navigation.navigate('Beds'),
    },
    {
      title: 'Notifications',
      subtitle: 'Check for new admissions',
      icon: 'notifications-outline',
      color: '#F59E0B',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      title: 'My Assignments',
      subtitle: 'View beds assigned to you',
      icon: 'list-outline',
      color: '#3B82F6',
      onPress: () => navigation.navigate('MyAssignments'),
    },
  ];

  if (user?.role === 'admin') {
    dashboardItems.push({
      title: 'Admin Panel',
      subtitle: 'Manage system users',
      icon: 'people-outline',
      color: '#8B5CF6',
      onPress: () => navigation.navigate('Admin'),
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name}!</Text>
        <Text style={styles.role}>Your role: {user?.role}</Text>
      </View>

      <View style={styles.grid}>
        {dashboardItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={item.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <Ionicons name={item.icon} size={32} color={item.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAssignmentModal(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        visible={showAssignmentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bed Assignments</Text>
            {!forceRequired && (
              <TouchableOpacity
                onPress={() => setShowAssignmentModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            )}
          </View>
          <AssignmentsScreen 
            closeModal={() => setShowAssignmentModal(false)}
            isModal={true}
          />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  role: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  grid: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
});