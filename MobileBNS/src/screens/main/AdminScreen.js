import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import Toast from 'react-native-toast-message';

export default function AdminScreen() {
  const { user } = useAuth();
  const {
    stats,
    users,
    departments,
    loading,
    createWard,
    removeWardById,
    createBed,
    removeBedById,
    loadDepartments,
    loadUsers,
    loadStats,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('departments');
  const [selectedDept, setSelectedDept] = useState(null);
  const [newWardName, setNewWardName] = useState('');
  const [selectedWard, setSelectedWard] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  useEffect(() => {
    loadDepartments();
    loadUsers();
    loadStats();
  }, [user]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading admin data...</Text>
      </View>
    );
  }

  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {['departments', 'users'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Ionicons
              name={tab === 'departments' ? 'business' : 'people'}
              size={20}
              color={activeTab === tab ? '#4F46E5' : '#6B7280'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      {activeTab === 'departments' && stats && (
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>System Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={32} color="#3B82F6" />
              <Text style={styles.statNumber}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="business" size={32} color="#8B5CF6" />
              <Text style={styles.statNumber}>{stats.totalDepartments}</Text>
              <Text style={styles.statLabel}>Total Departments</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="bed" size={32} color="#10B981" />
              <Text style={styles.statNumber}>{stats.beds?.total || 0}</Text>
              <Text style={styles.statLabel}>Total Beds</Text>
            </View>
          </View>
        </View>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <View style={styles.departmentsContainer}>
          <Text style={styles.departmentsTitle}>Departments</Text>
          <FlatList
            data={departments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.departmentItem}
                onPress={() => setSelectedDept(item)}
              >
                <Text style={styles.departmentName}>{item.name}</Text>
                <Text style={styles.departmentInfo}>
                  {item.wards.length} Wards
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
      <Toast ref={(ref) => Toast.setRef(ref)} /> {/* Ensure Toast is included */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B7280',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#4F46E5',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  departmentsContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  departmentItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  departmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  departmentInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
});