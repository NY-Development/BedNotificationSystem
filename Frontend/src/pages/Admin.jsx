import React, { useState, useEffect } from "react";
import { useAdmin } from "../context/AdminContext";
import ConfirmModal from "../components/ConfirmModal";
import { useAuth } from "../context/AuthContext";
import GoBack from "../components/GoBack";
import { Users, Hospital, Bed } from "lucide-react";

const Admin = () => {
  const {
    stats,
    departments,
    users,
    loading,
    createWard,
    removeWardById,
    createBed,
    removeBedById,
    assignments,
    loadDepartments,
    loadUsers,
    removeUser,
    loadStats,
    loadAssignments,
  } = useAdmin();

  const { user } = useAuth();

  const [tab, setTab] = useState("departments");
  const [selectedDept, setSelectedDept] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [newWardName, setNewWardName] = useState("");
  const [newBedId, setNewBedId] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState({});

  useEffect(() => {
    loadDepartments();
    loadUsers();
    loadStats();
    loadAssignments();
  }, [user, tab]);

  if (loading) {
    return (
      <p className="p-8 text-center text-xl font-medium text-gray-700 animate-pulse">
        Loading...
      </p>
    );
  }

  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <GoBack />
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex flex-wrap space-x-2 sm:space-x-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setTab("departments")}
          className={`cp flex items-center space-x-2 px-4 py-3 rounded-t-lg font-semibold transition-colors duration-200 ${
            tab === "departments"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Hospital size={20} />
          <span>Departments & Wards</span>
        </button>
        <button
          onClick={() => setTab("users")}
          className={`cp flex items-center space-x-2 px-4 py-3 rounded-t-lg font-semibold transition-colors duration-200 ${
            tab === "users"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Users size={20} />
          <span>Users</span>
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="mb-8 bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">📊 System Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-3">
              <Users className="text-blue-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className="text-xl font-bold">{stats.totalUsers && stats.totalUsers === 1 ? user.name : stats.totalUsers}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg flex items-center space-x-3">
              <Hospital className="text-purple-500" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Departments</p>
                <p className="text-xl font-bold">{stats.totalDepartments}</p>
              </div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Beds</p>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <span className="bg-red-500 rounded-full w-3 h-3 block"></span>
                  <span className="text-sm">Occupied: {stats.beds.occupied}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="bg-green-500 rounded-full w-3 h-3 block"></span>
                  <span className="text-sm">Available: {stats.beds.available}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Departments Tab */}
      {tab === "departments" && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <div className="mb-6">
            <label className="block font-semibold text-lg mb-2 text-gray-700">
              Select Department
            </label>
            <select
              value={selectedDept?._id || ""}
              onChange={(e) => {
                const dept = departments.find((d) => d._id === e.target.value);
                setSelectedDept(dept);
                setSelectedWard(null);
              }}
              className="border border-gray-300 p-2 rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {selectedDept && (
            <>
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  Wards in {selectedDept.name}
                </h3>
                <ul className="space-y-3">
                  {selectedDept.wards.map((ward) => (
                    <li
                      key={ward._id}
                      className={`p-4 rounded-lg flex justify-between items-center transition-all duration-200 ${
                        selectedWard?._id === ward._id
                          ? "bg-indigo-100 border-2 border-indigo-400"
                          : "bg-gray-50 border border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <span className="font-semibold text-gray-700">
                        {ward.name} ({ward.beds.length} beds)
                      </span>
                      <div className="space-x-2 flex">
                        <button
                          onClick={() => setSelectedWard(ward)}
                          className="cp px-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Manage Beds
                        </button>
                        <button
                          onClick={() =>
                            openConfirm(
                              "Remove Ward",
                              `Are you sure you want to remove ward "${ward.name}"?`,
                              () => removeWardById(selectedDept._id, ward._id)
                            )
                          }
                          className="cp px-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex space-x-2">
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
                        createWard(selectedDept._id, newWardName.trim());
                        setNewWardName("");
                      }
                    }}
                    className="cp px-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Add Ward
                  </button>
                </div>
              </div>

              {selectedWard && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">
                    Beds in {selectedWard.name}
                  </h3>
                  <ul className="space-y-3">
                    <div className="flex space-x-2">
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
                            createBed(selectedDept._id, selectedWard._id, newBedId.trim());
                            setNewBedId("");
                          }
                        }}
                        className="cp px-1 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                      >
                        Add Bed
                      </button>
                    </div>
                    {selectedWard.beds.map((bed) => (
                      <li
                        key={bed._id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="font-semibold text-gray-700 flex items-center space-x-2">
                          <Bed size={20} />
                          <span>Bed ID: {bed.id}</span>
                          <span
                            className={`text-sm ml-2 font-medium px-2 py-1 rounded-full ${
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
                              () => removeBedById(selectedDept._id, selectedWard._id, bed._id)
                            )
                          }
                          className="cp px-1 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="bg-white shadow-lg p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold mb-3 flex items-center space-x-2 text-gray-800">
            <Users size={24} />
            <span>All Users</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Assigned Beds
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => {
                  const userAssignments = assignments.filter(
                    (assign) => assign.user?._id === u._id
                  );

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {u.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {userAssignments.length > 0 ? (
                          <ul className="space-y-1">
                            {userAssignments.map((assign, idx) => (
                              <li
                                key={idx}
                                className="font-medium text-gray-700"
                              >
                                {assign?.department?.name} – {assign?.ward}:{" "}
                                {assign?.beds?.length} {`${assign?.beds?.length === 1 ? 'bed' : 'beds'}`}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 italic">No beds</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() =>
                            openConfirm(
                              "Delete User",
                              `Are you sure you want to delete user "${u.name}"?`,
                              () => removeUser(u._id)
                            )
                          }
                          className="cp bg-red-600 text-white rounded-md font-medium hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
