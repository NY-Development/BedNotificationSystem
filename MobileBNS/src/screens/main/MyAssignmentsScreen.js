import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAssignment } from '../../context/AssignmentContext';
import { useAuth } from '../../context/AuthContext';

export default function MyAssignmentsScreen() {
  const { getUserAssignment, userAssign } = useAssignment();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      getUserAssignment();
    }
  }, [user]);

  const hasAssignments = userAssign && userAssign.beds && userAssign.beds.length > 0;

  const renderBed = ({ item: bed }) => (
    <View style={[
      styles.bedCard,
      { borderLeftColor: bed.status === 'available' ? '#10B981' : '#EF4444' }
    ]}>
      <View style={styles.bedHeader}>
        <Text style={styles.bedId}>Bed {bed.id}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: bed.status === 'available' ? '#D1FAE5' : '#FEE2E2' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: bed.status === 'available' ? '#059669' : '#DC2626' }
          ]}>
            {bed.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.bedDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            Assigned to: {userAssign.createdBy.name}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="mail" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {userAssign.createdBy.email}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="school" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {userAssign.createdBy.role === 'c1' 
              ? 'Clinical Year I Student'
              : userAssign.createdBy.role === 'c2' 
              ? 'Clinical Year II Student' 
              : 'Intern'
            }
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="business" size={16} color="#6B7280" />
          <Text style={styles.detailText}>
            {userAssign.department}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="bed" size={32} color="#4F46E5" />
        <Text style={styles.title}>Your Bed Assignments</Text>
      </View>

      {hasAssignments ? (
        <ScrollView style={styles.content}>
          <View style={styles.assignmentInfo}>
            <Text style={styles.wardTitle}>{userAssign.ward}</Text>
            <Text style={styles.departmentName}>{userAssign.department}</Text>
          </View>
          
          <FlatList
            data={userAssign.beds}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderBed}
            scrollEnabled={false}
            contentContainerStyle={styles.bedsList}
          />
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="bed-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Bed Assignments</Text>
          <Text style={styles.emptySubtitle}>
            You've earned a break! No beds assigned to you right now.
          </Text>
          <Text style={styles.emptyNote}>
            Check back later for new assignments.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  assignmentInfo: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
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
  wardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  departmentName: {
    fontSize: 18,
    color: '#6B7280',
  },
  bedsList: {
    padding: 16,
  },
  bedCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
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
  bedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bedId: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  bedDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
    flex: 1,
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
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emptyNote: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});