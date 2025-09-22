import { createContext, useContext, useState } from "react";
import {
  getStats,
  getAllUsers,
  getAllAssignments,
  getAllDepartments,
  addDepartment,
  deleteDepartment,
  addWard,
  deleteWard,
  addBed,
  deleteBed,
  deleteUser,
} from "../services/adminService";
import { toast } from "react-hot-toast";
import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const handleError = (err) => {
    if (err.response && err.response.status === 401) return;
    console.error("Admin error:", err);
    toast.error(err?.response?.data?.message || "Something went wrong");
  };

  // ---- Loaders ----
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

  // ---- CRUD Operations ----
  const createDepartment = async (name) => {
    try {
      await addDepartment(name);
      toast.success("Department added!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const removeDepartment = async (deptId) => {
    try {
      await deleteDepartment(deptId);
      toast.success("Department deleted!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const createWard = async (deptId, wardName) => {
    try {
      await addWard(deptId, wardName);
      toast.success("Ward added!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const removeWardById = async (deptId, wardId) => {
    try {
      await deleteWard(deptId, wardId);
      toast.success("Ward deleted!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const createBed = async (deptId, wardId, bedId) => {
    try {
      await addBed(deptId, wardId, { id: bedId, status: "available" });
      toast.success("Bed added!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const removeBedById = async (deptId, wardId, bedId) => {
    try {
      await deleteBed(deptId, wardId, bedId);
      toast.success("Bed deleted!");
      loadDepartments();
    } catch (err) {
      handleError(err);
    }
  };

  const removeUser = async (id) => {
    try {
      await deleteUser(id);
      toast.success("User successfully deleted!");
      loadUsers();
    } catch (err) {
      handleError(err);
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
        createDepartment,
        removeDepartment,
        createWard,
        removeWardById,
        createBed,
        removeBedById,
        removeUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
