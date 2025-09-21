import React, { useState } from 'react';
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
import { useBed } from '../../context/BedContext';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function BedsScreen() {
  const { user } = useAuth();
  const { departments, loading, admit, discharge } = useBed();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading departments...</Text>
      </View>
    );
  }

  const currentDepartment = selectedDepartment || (departments.length > 0 ? departments[0] : null);

  const handleAdmit = (deptId, wardName, bedId, bed) => {
    if (bed.assignedUser?._id === user._id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You cannot admit yourself.',
      });
    } else {
      admit(deptId, wardName, bedId);
    }
  };

  const handleDischarge = (deptId, wardName, bedId, bed) => {
    if (bed.assignedUser?._id === user._id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'You cannot discharge yourself.',
      });
    } else {
      discharge(deptId, wardName, bedId);
    }
  };

  const renderBed = (bed, ward, department) => (
    <View key={bed.id} style={[
      styles.bedCard,
      { borderLeftColor: bed.status === 'occupied' ? '#EF4444' : '#10B981' }
    ]}>
      <View style={styles.bedHeader}>
        <Text style={styles.bedId}>Bed {bed.id}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: bed.status === 'occupied' ? '#FEE2E2' : '#D1FAE5' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: bed.status === 'occupied' ? '#DC2626' : '#059669' }
          ]}>
            {bed.status}
          </Text>
        </View>
      </View>
      
      <Text style={styles.assignedUser}>
        Assigned to: {bed.assignedUser?.name || 'Not assigned'}
      </Text>
      
      <View style={styles.bedActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.admitButton,
            bed.status === 'occupied' && styles.disabledButton
          ]}
          onPress={() => handleAdmit(department._id, ward.name, bed.id, bed)}
          disabled={bed.status === 'occupied'}
        >
          <Text style={styles.actionButtonText}>
            {bed.status === 'occupied' ? 'Patient Admitted' : 'Admit Patient'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.dischargeButton,
            bed.status === 'available' && styles.disabledButton
          ]}
          onPress={() => handleDischarge(department._id, ward.name, bed.id, bed)}
          disabled={bed.status === 'available'}
        >
          <Text style={styles.actionButtonText}>
            {bed.status === 'available' ? 'Patient Discharged' : 'Discharge Patient'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderWard = (ward) => {
    const totalBeds = ward.beds.length;
    const occupiedBeds = ward.beds.filter(bed => bed.status === 'occupied').length;
    const availableBeds = totalBeds - occupiedBeds;

    return (
      <View key={ward.name} style={styles.wardCard}>
        <View style={styles.wardHeader}>
          <Text style={styles.wardName}>{ward.name}</Text>
          <View style={styles.wardStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{occupiedBeds}</Text>
              <Text style={styles.statLabel}>Occupied</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{availableBeds}</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
          </View>
        </View>
        
        <ScrollView style={styles.bedsContainer}>
          {ward.beds.map(bed => renderBed(bed, ward, currentDepartment))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.departmentSelector}
          onPress={() => setShowDepartmentModal(true)}
        >
          <Text style={styles.departmentName}>
            {currentDepartment?.name || 'Select Department'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {currentDepartment && (
        <ScrollView style={styles.content}>
          {currentDepartment.wards.map(renderWard)}
        </ScrollView>
      )}

      <Modal
        visible={showDepartmentModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Department</Text>
            <TouchableOpacity
              onPress={() => setShowDepartmentModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={departments}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.departmentItem,
                  currentDepartment?._id === item._id && styles.selectedDepartment
                ]}
                onPress={() => {
                  setSelectedDepartment(item);
                  setShowDepartmentModal(false);
                }}
              >
                <Text style={[
                  styles.departmentItemText,
                  currentDepartment?._id === item._id && styles.selectedDepartmentText
                ]}>
                  {item.name}
                </Text>
                {currentDepartment?._id === item._id && (
                  <Ionicons name="checkmark" size={20} color="#4F46E5" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
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
  header: {
    backgroundColor: 'white',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  departmentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  departmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  wardCard: {
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
  wardHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  wardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  wardStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bedsContainer: {
    maxHeight: 300,
    padding: 16,
  },
  bedCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  bedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bedId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  assignedUser: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  bedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  admitButton: {
    backgroundColor: '#3B82F6',
  },
  dischargeButton: {
    backgroundColor: '#10B981',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
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
  departmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedDepartment: {
    backgroundColor: '#EEF2FF',
  },
  departmentItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedDepartmentText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});