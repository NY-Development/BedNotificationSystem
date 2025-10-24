import React, { useState, useEffect } from "react";
import { useSupervisor } from "../context/SupervisorContext";
import ConfirmModal from "../components/ConfirmModal";
import GoBack from "../components/GoBack";
import { Hospital, Bed, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../services/supervisorAPI";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const Admin = () => {
  const {
    departments,
    loading,
    createDepartment,
    removeDepartment,
    createWard,
    removeWardById,
    createBed,
    removeBedById,
    loadDepartments,
  } = useSupervisor();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("departments");
  const [users, setUsers] = useState([]);

  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [newDeptName, setNewDeptName] = useState("");
  const [newWardName, setNewWardName] = useState("");
  const [newBedId, setNewBedId] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  // ---- Load departments on mount ----
  useEffect(() => {
    loadDepartments();
  }, []);

  // ---- Load users when "Users" tab active ----
  useEffect(() => {
    if (activeTab === "users") {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load users");
    }
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  if (loading) {
    return (
      <p className="p-8 text-center text-xl font-medium text-gray-700 animate-pulse">
        Loading...
      </p>
    );
  }

  if (!user?.subscription?.isActive) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Please log in to view this page.
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full shadow-lg transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <GoBack />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
        Supervisor Panel
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("departments")}
          className={`cp pb-2 px-4 font-semibold ${
            activeTab === "departments"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Departments
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`cp pb-2 px-4 font-semibold ${
            activeTab === "users"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Users
        </button>
      </div>

      {/* Tab 1: Departments */}
      {activeTab === "departments" && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-gray-800">
            <Hospital size={24} />
            <span>Departments & Wards</span>
          </h2>

          {/* Create Department */}
          <div className="mb-6 flex md:flex-row flex-col md:space-x-2 space-y-2">
            <input
              type="text"
              value={newDeptName}
              onChange={(e) => setNewDeptName(e.target.value)}
              placeholder="New department name"
              className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (newDeptName.trim()) {
                  createDepartment(newDeptName.trim());
                  setNewDeptName("");
                }
              }}
              className="cp p-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
            >
              Add Department
            </button>
          </div>

          {/* Department List */}
          <div className="space-y-4">
            {departments.map((dept) => (
              <div
                key={dept._id}
                className={`p-4 rounded-lg border transition-all ${
                  selectedDept?._id === dept._id
                    ? "bg-indigo-50 border-indigo-400"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex md:flex-row flex-col space-y-2 justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">
                    {dept.name}
                  </h3>
                  <div className="flex flex-row space-x-2">
                    <button
                      onClick={() => {
                        if (selectedDept?._id === dept._id) {
                          setSelectedDept(null);
                          setSelectedWard(null);
                        } else {
                          setSelectedDept(dept);
                          setSelectedWard(null);
                        }
                      }}
                      className={`cp px-2 py-1 rounded-md text-white ${
                        selectedDept?._id === dept._id
                          ? "bg-gray-600 hover:bg-gray-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {selectedDept?._id === dept._id
                        ? "Hide Wards"
                        : "Show Wards"}
                    </button>
                    <button
                      onClick={() =>
                        openConfirm(
                          "Remove Department",
                          `Are you sure you want to delete department "${dept.name}"?`,
                          () => removeDepartment(dept._id)
                        )
                      }
                      className="cp px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Wards */}
                {selectedDept?._id === dept._id && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Wards in {dept.name}
                    </h4>
                    <ul className="space-y-3">
                      {dept.wards.map((ward) => (
                        <li
                          key={ward._id}
                          className={`p-3 rounded-lg flex md:flex-row flex-col justify-between items-center ${
                            selectedWard?._id === ward._id
                              ? "bg-indigo-100 border-2 border-indigo-400"
                              : "bg-white border border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          <span className="font-medium text-gray-700">
                            {ward.name} ({ward.beds.length} beds)
                          </span>
                          <div className="space-x-2 flex">
                            <button
                              onClick={() =>
                                setSelectedWard(
                                  selectedWard?._id === ward._id ? null : ward
                                )
                              }
                              className={`cp px-2 py-1 rounded-md text-white ${
                                selectedWard?._id === ward._id
                                  ? "bg-gray-600 hover:bg-gray-700"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {selectedWard?._id === ward._id
                                ? "Hide Beds"
                                : "Show Beds"}
                            </button>
                            <button
                              onClick={() =>
                                openConfirm(
                                  "Remove Ward",
                                  `Are you sure you want to remove ward "${ward.name}"?`,
                                  () => removeWardById(dept._id, ward._id)
                                )
                              }
                              className="cp px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>

                    {/* Add Ward */}
                    <div className="mt-4 flex md:flex-row flex-col md:space-x-2 space-y-2">
                      <input
                        type="text"
                        value={newWardName}
                        onChange={(e) => setNewWardName(e.target.value)}
                        placeholder="New ward name"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => {
                          if (newWardName.trim()) {
                            createWard(dept._id, newWardName.trim());
                            setNewWardName("");
                          }
                        }}
                        className="cp p-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        Add Ward
                      </button>
                    </div>
                  </div>
                )}

                {/* Beds */}
                {selectedWard && selectedDept?._id === dept._id && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-700 mb-3">
                      Beds in {selectedWard.name}
                    </h4>
                    <ul className="space-y-3">
                      {selectedWard.beds.map((bed) => (
                        <li
                          key={bed._id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                        >
                          <div className="flex items-center space-x-2">
                            <Bed size={20} />
                            <span className="font-semibold text-gray-700">
                              {bed.id}
                            </span>
                            <span
                              className={`text-sm px-2 py-1 rounded-full ${
                                bed.status === "occupied"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {bed.status}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              openConfirm(
                                "Remove Bed",
                                `Are you sure you want to remove bed "${bed.id}"?`,
                                () =>
                                  removeBedById(
                                    dept._id,
                                    selectedWard._id,
                                    bed._id
                                  )
                              )
                            }
                            className="cp px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Remove
                          </button>
                        </li>
                      ))}
                    </ul>

                    {/* Add Bed */}
                    <div className="mt-4 flex md:flex-row flex-col md:space-x-2 space-y-2">
                      <input
                        type="text"
                        value={newBedId}
                        onChange={(e) => setNewBedId(e.target.value)}
                        placeholder="New bed ID"
                        className="border border-gray-300 p-2 rounded-lg flex-1 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => {
                          if (newBedId.trim()) {
                            createBed(
                              dept._id,
                              selectedWard._id,
                              newBedId.trim()
                            );
                            setNewBedId("");
                          }
                        }}
                        className="cp p-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        Add Bed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Users */}
      {activeTab === "users" && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2 text-gray-800">
            <Users size={24} />
            <span>Users</span>
          </h2>

          {users.length === 0 ? (
            <p className="text-gray-600">No users found.</p>
          ) : (
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Name
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Email
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Role
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Subscription Status
                  </th>
                  <th className="border border-gray-200 px-4 py-2 text-left">
                    Subscription Ends
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2">
                      {u.name}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {u.email}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {u.role}
                    </td>
                    <td className={`${u?.subscription?.isActive ? 'text-green-500' : 'text-red-500'} font-bold border border-gray-200 px-4 py-2`}>
                      {u?.subscription?.isActive ? 'Active' : 'Inactive'}
                    </td>
                    <td className="border border-gray-200 px-4 py-2">
                      {u?.subscription?.endDate || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default Admin;
