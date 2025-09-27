import { createContext, useContext, useEffect, useState } from "react";
import {
  fetchDepartments,
  admitPatient,
  dischargePatient,
} from "../services/bed";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

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
      if (res.notifyUser) {
        toast.success(res.message); 
      } else {
        toast.success(res.message || "Admit handled");
      }

      loadDepartments();
      window.location.reload();
    } catch (err) {
      handleError(err)
    }
  };

  // Discharge
  const discharge = async (deptId, wardName, bedId) => {
    try {
      const res = await dischargePatient({ deptId, wardName, bedId });

      if (res.notifyUser) {
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
