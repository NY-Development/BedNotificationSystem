import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { getAssignmentExpiryForUser, getMyAssignment } from "../services/assignment";

const AssignmentContext = createContext();

export const AssignmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [expiry, setExpiry] = useState(null);
  const [userAssign, setUserAssign] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch expiry
  const fetchExpiry = async () => {
    if (!user) return null;
    try {
      const data = await getAssignmentExpiryForUser(user._id);
      setExpiry(data);
      return data; // ✅ return it
    } catch (err) {
      console.error("Error fetching assignment expiry", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Fetch user assignment
  const getUserAssignment = async () => {
    if (!user) return null;
    try {
      const data = await getMyAssignment();
      if (data && data.length > 0) {
        setUserAssign(data[0]);
        return data[0]; // ✅ return it
      }
      return null;
    } catch (err) {
      console.error("Error fetching user assignment", err);
      return null;
    }
  };

  return (
    <AssignmentContext.Provider
      value={{
        expiry,
        fetchExpiry,
        loading,
        getUserAssignment,
        userAssign,
      }}
    >
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignment = () => useContext(AssignmentContext);
