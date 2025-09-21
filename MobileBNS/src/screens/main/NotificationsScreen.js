import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getNotifications } from '../../services/notification';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderNotification = ({ item }) => (
    <View style={styles.notificationCard}>
      <View style={styles.notificationHeader}>
        <View style={[
          styles.typeIndicator,
          { backgroundColor: item.type === 'admit' ? '#FEE2E2' : '#FEF3C7' }
        ]}>
          <Ionicons 
            name={item.type === 'admit' ? 'person-add' : 'person-remove'} 
            size={16} 
            color={item.type === 'admit' ? '#DC2626' : '#D97706'} 
          />
        </View>
        <Text style={styles.timestamp}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.message}>{item.message}</Text>
      
      <View style={styles.notificationDetails}>
        <Text style={styles.detailText}>From: {item.from?.name || 'Unknown'}</Text>
        <Text style={styles.detailText}>Bed: {item.bedId}</Text>
        <Text style={styles.detailText}>Ward: {item.wardName}</Text>
        <Text style={styles.detailText}>Department: {item.departmentName}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderNotification}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
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
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#6B7280',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 22,
  },
  notificationDetails: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
  },
});