import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchDepartments,
  admitPatient,
  dischargePatient,
} from "../services/bed";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";
import { sendPatientInfo, updatePatientInfo } from "../services/department";

const BedContext = createContext();

export const BedProvider = ({ children }) => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch on logged in user.
  useEffect(() => {
    loadDepartments();
  }, [user]);

  const handleError = (err) => {
    return;
  };

  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await fetchDepartments();
      setDepartments(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

// Admit
  const admit = async (deptId, wardName, bedId) => {
    try {
      const res = await admitPatient({ deptId, wardName, bedId });
      // if backend returns a notification message
      if (res) {
        toast.success(res.message); 
      } else {
        toast.success(res.message || "Admit handled");
      }

      loadDepartments();
      window.location.reload();
    } catch (err) {
        toast.error("No user assigned to this bed.")
      handleError(err)
    }
  };

  // Discharge
  const discharge = async (deptId, wardName, bedId) => {
    try {
      const res = await dischargePatient({ deptId, wardName, bedId });

      if (res) {
        toast.success(res.message);
      } else {
        toast.success(res.message || "Discharge handled");
      }
      loadDepartments();
      window.location.reload();
    } catch (err) {
      handleError(err)
    }
  };

  const recordPatientInfo = async (info) => {
    try {
      const res = await sendPatientInfo(info);
      if (res) {
        toast.success(res.message);
      } else {
        toast.success(res.message || "Discharge handled");
      }
      loadDepartments();
      window.location.reload();
    } catch (err) {
      handleError(err)
    }
  };

  const updatePatientRecord = async (info) => {
    try {
      // Determine if we should update or record new
      // If the bed already has a patient object, we use update
      const res = await updatePatientInfo(info); 
      
      // Refresh departments to show updated data
      await fetchDepartments(); 
      toast.success("Patient record updated successfully");
      return res;
    } catch (err) {
      console.error("Update failed", err);
      toast.error(err.response?.data?.message || "Failed to update record");
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
        recordPatientInfo,
        updatePatientRecord,
      }}
    >
      {children}
    </BedContext.Provider>
  );
};

export const useBed = () => useContext(BedContext);
