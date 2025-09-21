import React, { createContext, useContext, useState } from 'react';
import {
  getStats,
  getAllUsers,
  getAllAssignments,
  getAllDepartments,
  updateData,
} from '../services/adminService';
import Toast from 'react-native-toast-message';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleError = (err) => {
    if (err.response && err.response.status === 401) {
      return;
    }
    console.log('An error occurred:', err);
  };

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      handleError(err);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      handleError(err);
    }
  };

  const loadAssignments = async () => {
    try {
      const data = await getAllAssignments();
      setAssignments(data);
    } catch (err) {
      handleError(err);
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        users,
        assignments,
        departments,
        loading,
        loadDepartments,
        loadStats,
        loadUsers,
        loadAssignments,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);