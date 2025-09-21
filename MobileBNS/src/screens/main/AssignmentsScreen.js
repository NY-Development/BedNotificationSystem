import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createAssignment, updateAssignment } from '../../services/assignment';
import { getDepartments } from '../../services/department';
import { useBed } from '../../context/BedContext';
import { useAuth } from '../../context/AuthContext';
import Toast from 'react-native-toast-message';

export default function AssignmentsScreen({ closeModal, updateAssign = false, isModal = false }) {
  const { loadDepartments } = useBed();
  const { user } = useAuth();

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    deptId: '',
    wardName: '',
    beds: [],
    deptExpiry: '',
    wardExpiry: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showWardModal, setShowWardModal] = useState(false);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, []);

  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);

  const handleSubmit = async () => {
    if (!form.deptId || !form.wardName || !form.deptExpiry || !form.wardExpiry || form.beds.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    setLoading(true);
    try {
      if (updateAssign) {
        await updateAssignment(user._id, form);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Assignment updated successfully!',
        });
      } else {
        await createAssignment(form);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Assignment saved!',
        });
      }
      loadDepartments();
      if (closeModal) closeModal();
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save assignment',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBedToggle = (bedId) => {
    const newBeds = form.beds.includes(bedId)
      ? form.beds.filter((id) => id !== bedId)
      : [...form.beds, bedId];
    setForm({ ...form, beds: newBeds });
  };

  const renderDepartmentSelector = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>Department *</Text>
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setShowDepartmentModal(true)}
      >
        <Text style={[styles.selectorText, !selectedDept && styles.placeholder]}>
          {selectedDept ? selectedDept.name : 'Select Department'}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );

  const renderWardSelector = () => {
    if (!selectedDept) return null;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Ward *</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowWardModal(true)}
        >
          <Text style={[styles.selectorText, !form.wardName && styles.placeholder]}>
            {form.wardName || 'Select Ward'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderBedSelection = () => {
    if (!selectedWard) return null;

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Select Beds *</Text>
        <ScrollView style={styles.bedContainer} nestedScrollEnabled>
          <View style={styles.bedGrid}>
            {selectedWard.beds.map((bed) => (
              <TouchableOpacity
                key={bed.id}
                style={[
                  styles.bedItem,
                  form.beds.includes(bed.id) && styles.selectedBed,
                  bed.status === 'occupied' && styles.occupiedBed,
                ]}
                onPress={() => handleBedToggle(bed.id)}
              >
                <Text style={[
                  styles.bedText,
                  form.beds.includes(bed.id) && styles.selectedBedText,
                ]}>
                  Bed {bed.id}
                </Text>
                <Text style={[
                  styles.bedStatus,
                  form.beds.includes(bed.id) && styles.selectedBedText,
                ]}>
                  {bed.status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <ScrollView style={[styles.container, isModal && styles.modalContainer]}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {updateAssign ? 'Update Assignment' : 'Create Assignment'}
        </Text>

        {renderDepartmentSelector()}

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Department Expiry *</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            value={form.deptExpiry}
            onChangeText={(value) => setForm({ ...form, deptExpiry: value })}
          />
        </View>

        {renderWardSelector()}

        {form.wardName && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ward Expiry *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={form.wardExpiry}
              onChangeText={(value) => setForm({ ...form, wardExpiry: value })}
            />
          </View>
        )}

        {renderBedSelection()}

        <TouchableOpacity
          style={[
            styles.submitButton,
            (!form.deptId || !form.wardName || !form.deptExpiry || !form.wardExpiry || form.beds.length === 0) && styles.disabledButton
          ]}
          onPress={handleSubmit}
          disabled={loading || !form.deptId || !form.wardName || !form.deptExpiry || !form.wardExpiry || form.beds.length === 0}
        >
          <Text style={styles.submitButtonText}>
            {loading ? 'Saving...' : updateAssign ? 'Update Assignment' : 'Save Assignment'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Department Selection Modal */}
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
                  styles.modalItem,
                  form.deptId === item._id && styles.selectedModalItem
                ]}
                onPress={() => {
                  setForm({ ...form, deptId: item._id, wardName: '', beds: [] });
                  setShowDepartmentModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  form.deptId === item._id && styles.selectedModalItemText
                ]}>
                  {item.name}
                </Text>
                {form.deptId === item._id && (
                  <Ionicons name="checkmark" size={20} color="#4F46E5" />
                )}
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>

      {/* Ward Selection Modal */}
      <Modal
        visible={showWardModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Ward</Text>
            <TouchableOpacity
              onPress={() => setShowWardModal(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={selectedDept?.wards || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  form.wardName === item.name && styles.selectedModalItem
                ]}
                onPress={() => {
                  setForm({ ...form, wardName: item.name, beds: [] });
                  setShowWardModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  form.wardName === item.name && styles.selectedModalItemText
                ]}>
                  {item.name}
                </Text>
                {form.wardName === item.name && (
                  <Ionicons name="checkmark" size={20} color="#4F46E5" />
                )}
              </TouchableOpacity>
            )}
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'white',
  },
  selectorText: {
    fontSize: 16,
    color: '#1F2937',
  },
  placeholder: {
    color: '#9CA3AF',
  },
  bedContainer: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
    padding: 12,
  },
  bedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bedItem: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  selectedBed: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  occupiedBed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  bedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  bedStatus: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedBedText: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  selectedModalItem: {
    backgroundColor: '#EEF2FF',
  },
  modalItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedModalItemText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});