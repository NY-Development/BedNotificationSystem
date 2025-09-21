import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  fetchDepartments,
  admitPatient,
  dischargePatient,
} from '../services/bed';
import Toast from 'react-native-toast-message';
import { useAuth } from './AuthContext';

const BedContext = createContext();

export const BedProvider = ({ children }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDepartments();
    }
  }, [user]);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Failed to fetch departments', err);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load departments',
      });
    } finally {
      setLoading(false);
    }
  };

  const admit = async (deptId, wardName, bedId) => {
    try {
      const res = await admitPatient({ deptId, wardName, bedId });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.message || 'Admit handled',
      });
      loadDepartments();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Admit failed',
      });
    }
  };

  const discharge = async (deptId, wardName, bedId) => {
    try {
      const res = await dischargePatient({ deptId, wardName, bedId });
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: res.message || 'Discharge handled',
      });
      loadDepartments();
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: err.response?.data?.message || 'Discharge failed',
      });
    }
  };

  return (
    <BedContext.Provider
      value={{
        departments,
        loading,
        admit,
        discharge,
        loadDepartments,
      }}
    >
      {children}
    </BedContext.Provider>
  );
};

export const useBed = () => useContext(BedContext);