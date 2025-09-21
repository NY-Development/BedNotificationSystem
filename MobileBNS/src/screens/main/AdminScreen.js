import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAdmin } from '../../context/AdminContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminScreen() {
  const { user } = useAuth();
  const {
    stats,
    users,
    assignments,
    departments,
    loading,
    loadStats,
    loadUsers,
    loadAssignments,
    loadDepartments,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats();
      loadUsers();
      loadAssignments();
      loadDepartments();
    }
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <View style={styles.unauthorizedContainer}>
        <Ionicons name="lock-closed" size={80} color="#DC2626" />
        <Text style={styles.unauthorizedTitle}>Access Denied</Text>
        <Text style={styles.unauthorizedSubtitle}>Admin access required</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading admin data...</Text>
      </View>
    );
  }

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      {stats && (
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="people" size={32} color="#3B82F6" />
            <Text style={styles.statNumber}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="business" size={32} color="#8B5CF6" />
            <Text style={styles.statNumber}>{stats.totalDepartments}</Text>
            <Text style={styles.statLabel}>Departments</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="bed" size={32} color="#10B981" />
            <Text style={styles.statNumber}>{stats.beds?.total || 0}</Text>
            <Text style={styles.statLabel}>Total Beds</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={32} color="#059669" />
            <Text style={styles.statNumber}>{stats.beds?.available || 0}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
          
          <View style={styles.statCard}>
            <Ionicons name="close-circle" size={32} color="#DC2626" />
            <Text style={styles.statNumber}>{stats.beds?.occupied || 0}</Text>
            <Text style={styles.statLabel}>Occupied</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const renderUsersTab = () => (
    <FlatList
      data={users}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{item.role.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.userAction}>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      )}
      contentContainerStyle={styles.tabContent}
    />
  );

  const renderDepartmentsTab = () => (
    <FlatList
      data={departments}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.departmentCard}>
          <Text style={styles.departmentName}>{item.name}</Text>
          <Text style={styles.departmentInfo}>
            {item.wards?.length || 0} wards
          </Text>
          <Text style={styles.departmentInfo}>
            {item.wards?.reduce((total, ward) => total + (ward.beds?.length || 0), 0) || 0} beds
          </Text>
        </View>
      )}
      contentContainerStyle={styles.tabContent}
    />
  );

  const tabs = [
    { id: 'stats', title: 'Statistics', icon: 'bar-chart' },
    { id: 'users', title: 'Users', icon: 'people' },
    { id: 'departments', title: 'Departments', icon: 'business' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Ionicons 
              name={tab.icon} 
              size={20} 
              color={activeTab === tab.id ? '#4F46E5' : '#6B7280'} 
            />
            <Text style={[
              styles.tabText,
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'departments' && renderDepartmentsTab()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  unauthorizedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  unauthorizedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 16,
  },
  unauthorizedSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
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
    paddingHorizontal: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
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
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  userCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  roleBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  userAction: {
    padding: 8,
  },
  departmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  departmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  departmentInfo: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
});