import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import { getAssignmentExpiryForUser, getMyAssignment } from '../services/assignment';

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [deptExpiry, setDeptExpiry] = useState(null);
  const [wardExpiry, setWardExpiry] = useState(null);
  const [expiry, setExpiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userAssign, setUserAssign] = useState();

  const fetchExpiry = async () => {
    if (!user) return;
    try {
      const data = await getAssignmentExpiryForUser(user._id);
      setExpiry(data);

      if (data) {
        const formattedDeptExpiry = data.deptExpiry ? new Date(data.deptExpiry).toISOString().split('T')[0] : null;
        const formattedWardExpiry = data.wardExpiry ? new Date(data.wardExpiry).toLocaleDateString('en-CA') : null;

        setDeptExpiry(formattedDeptExpiry);
        setWardExpiry(formattedWardExpiry);
      }
    } catch (err) {
      console.error('Error fetching assignment expiry', err);
    } finally {
      setLoading(false);
    }
  };

  const getUserAssignment = async () => {
    if (!user) return;
    try {
      const data = await getMyAssignment();
      if (data) {
        setUserAssign(data[0]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AssignmentContext.Provider value={{ 
      expiry, 
      deptExpiry, 
      wardExpiry, 
      fetchExpiry, 
      loading, 
      getUserAssignment, 
      userAssign 
    }}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => useContext(AssignmentContext);