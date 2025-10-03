import React, { useState, useEffect, useCallback } from "react";
import {
  getAllUsers,
  deleteUser,
  getAllDepartments,
  addDepartment,
  deleteDepartment,
  sendRefinedMessage,
  getStats,
  activateSubscription,
  deactivateSubscription,
  addWard,
  deleteWard,
  addBed,
  deleteBed,
  updateUserData,
  getMessages,
  updateMessageReadStatus,
  getAllAssignments,
  getAllNotifications,
  getRoleChangeRequests,
  updateUserRole,
} from "../services/adminService";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import SearchBar from "../components/SearchBar";
import toast from "react-hot-toast";

import { 
    FiUsers, 
    FiGlobe, 
    FiClipboard, 
    FiBell, 
    FiMail, 
    FiActivity,
    FiUserCheck,
    FiTrash2,
    FiSend,
    FiCheckCircle,
    FiXCircle
} from 'react-icons/fi';
import { FaBed, FaSpinner } from 'react-icons/fa';

// --- Constants ---
const USER_ROLES = ["c1", "c2", "intern", "supervisor", "admin"];
const PIE_COLORS = ["#4F46E5", "#00C4FF", "#FFBB28", "#EF4444", "#10B981"];

const getRoleName = (role) => {
  switch (role) {
    case "c1":
      return "Clinical Year I";
    case "c2":
      return "Clinical Year II";
    case "intern":
      return "Intern";
    case "supervisor":
      return "Supervisor";
    case "admin":
      return "Admin";
    default:
      return "User";
  }
};

const MainAdmin = () => {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);

  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // ---- Load Data ----
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const statsRes = await getStats();
        setStats(statsRes);
      } else if (tab === "users") {
        const usersRes = await getAllUsers();
        setUsers(usersRes);
        setFilteredUsers(usersRes);
      } else if (tab === "departments") {
        const deptRes = await getAllDepartments();
        setDepartments(deptRes);
        setFilteredDepartments(deptRes);
      } else if (tab === "support") {
        const msg = await getMessages();
        setMessages(msg);
      } else if (tab === "assignments") {
        const assignRes = await getAllAssignments();
        setAssignments(assignRes);
        setFilteredAssignments(assignRes);
      } else if (tab === "notifications") {
        const notifRes = await getAllNotifications();
        setNotifications(notifRes);
        setFilteredNotifications(notifRes);
      } else if (tab === "role-requests") {
        const reqRes = await getRoleChangeRequests();
        setRoleRequests(reqRes.requests || []);
      }
    } catch (error) {
      console.error(`Error loading ${tab} data:`, error);
    } finally {
      setLoading(false);
    }
  }, [tab, user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

//Add department form
const AddDepartmentForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await addDepartment({ name });
      toast.success("Department added successfully");
      setName("");
      onSuccess?.();
    } catch (err) {
      toast.error("Failed to add department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New Department Name"
        className="flex-1 p-3 border rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
      >
        {loading ? "Adding..." : "Add Department"}
      </button>
    </form>
  );
};

//Add WArd form
const WardForm = ({ deptId, onAdd, handleAddWard }) => {
  const [wardName, setWardName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wardName.trim()) return;
    setLoading(true);
    try {
      await handleAddWard(deptId, wardName);
      setWardName("");
      onAdd?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={wardName}
        onChange={(e) => setWardName(e.target.value)}
        placeholder="New Ward"
        className="p-2 border rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700 transition-colors"
      >
        {loading ? "Adding..." : "Add Ward"}
      </button>
    </form>
  );
};

//Add bed form 
const BedForm = ({ deptId, wardId, onAdd, handleAddBed }) => {
  const [bedId, setBedId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!bedId.trim()) return;
    setLoading(true);
    try {
      await handleAddBed(deptId, wardId, bedId);
      setBedId("");
      onAdd?.();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-1">
      <input
        type="text"
        value={bedId}
        onChange={(e) => setBedId(e.target.value)}
        placeholder="Bed ID"
        className="p-1 border rounded-lg text-xs focus:ring-green-500 focus:border-green-500"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-2 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
      >
        {loading ? "Adding..." : "+"}
      </button>
    </form>
  );
};

  // ---- Role Request Actions ----
  const handleApprove = async (userId, role) => {
    try {
      const res = await updateUserRole(userId, role);
      toast.success(res.message);
      loadData();
    } catch (err) {
      toast.error("Failed to approve request");
    }
  };
  
// ---- User Role Change ----
const handleRoleChange = async (userId, newRole) => {
  try {
    const res = await updateUserRole(userId, newRole);
    toast.success(res.message);
    loadData();
  } catch (err) {
    toast.error("Failed to update user role");
  }
};

// ---- Subscription Actions ----
const handleSubscriptionAction = async (userId, action) => {
  try {
    if (action === "activate") {
      const res = await activateSubscription(userId);
      toast.success(res.message);
    } else {
      const res = await deactivateSubscription(userId);
      toast.success(res.message);
    }
    loadData();
  } catch (err) {
    toast.error("Failed to update subscription");
  }
};

// ---- Delete User ----
const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;
  try {
    await deleteUser(userId);
    toast.success("User deleted successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to delete user");
  }
};

// ---- Department Management ----
const handleDeleteDepartment = async (deptId) => {
  if (!window.confirm("Delete this department? All wards will be removed!")) return;
  try {
    await deleteDepartment(deptId);
    toast.success("Department deleted successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to delete department");
  }
};

// ---- Ward Management ----
const handleAddWard = async (deptId, wardName) => {
  try {
    await addWard(deptId, { name: wardName });
    toast.success("Ward added successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to add ward");
  }
};

const handleDeleteWard = async (deptId, wardId) => {
  if (!window.confirm("Delete this ward? All beds will be removed!")) return;
  try {
    await deleteWard(deptId, wardId);
    toast.success("Ward deleted successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to delete ward");
  }
};

// ---- Bed Management ----
const handleAddBed = async (deptId, wardId, bedId) => {
  try {
    await addBed(deptId, wardId, { id: bedId });
    toast.success("Bed added successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to add bed");
  }
};

const handleDeleteBed = async (deptId, wardId, bedId) => {
  if (!window.confirm("Delete this bed?")) return;
  try {
    await deleteBed(deptId, wardId, bedId);
    toast.success("Bed deleted successfully");
    loadData();
  } catch (err) {
    toast.error("Failed to delete bed");
  }
};

// ---- Send Support / Refined Message ----
const [recipient, setRecipient] = useState("");
const [subject, setSubject] = useState("");
const [message, setMessage] = useState("");
const [supportStatus, setSupportStatus] = useState("");

const handleSendSupport = async (e) => {
  e.preventDefault();
  setSupportStatus("Sending...");
  try {
    await sendRefinedMessage({ recipient, subject, message });
    setSupportStatus("Message sent successfully");
    setRecipient("");
    setSubject("");
    setMessage("");
    loadData();
  } catch (err) {
    setSupportStatus("Failed to send message");
  }
};


  const handleDeny = async (userId) => {
    try {
      await updateUserRole(userId, "intern");
      toast.success("Request denied and role reset to intern");
      loadData();
    } catch (err) {
      toast.error("Failed to deny request");
    }
  };

  // ---- Render Role Requests ----
  const renderRoleRequests = () => (
    <div className="p-6 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <FiUserCheck className="mr-2 text-purple-600" /> Pending Role Change
        Requests
      </h2>

      {roleRequests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Current Role</th>
                <th className="px-4 py-2 border">Requested Role</th>
                <th className="px-4 py-2 border">Requested At</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {roleRequests.map((req) => (
                <tr key={req._id} className="text-center">
                  <td className="px-4 py-2 border">{req.name}</td>
                  <td className="px-4 py-2 border">{req.email}</td>
                  <td className="px-4 py-2 border">{getRoleName(req.role)}</td>
                  <td className="px-4 py-2 border">
                    {getRoleName(req.roleChangeRequest.role)}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(
                      req.roleChangeRequest.requestedAt
                    ).toLocaleString()}
                  </td>
                  <td className="flex flex-col md:flex-row space-y-2 px-4 py-2 border md:space-x-2">
                    <button
                      onClick={() =>
                        handleApprove(req._id, req.roleChangeRequest.role)
                      }
                      className="cp bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(req._id)}
                      className="cp bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );


  const renderDashboard = () => {

  const StatCard = ({ title, value, color, icon: Icon }) => (
  <div className={`p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl bg-white border-b-4 ${color.border}`}>
    <div className="flex items-center justify-between">
        <Icon className={`text-3xl ${color.text}`} />
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
    </div>
    <p className="text-4xl font-extrabold mt-3 text-gray-800">{value}</p>
  </div>
);

    if (!stats) return <p className="text-center text-gray-500">Loading statistics...</p>;

    const rolesData = stats.rolesCount.map(r => ({ name: getRoleName(r._id), value: r.count }));
    const bedData = [
      { name: "Occupied Beds", value: stats.beds.occupied, fill: PIE_COLORS[3] }, // Red
      { name: "Available Beds", value: stats.beds.available, fill: PIE_COLORS[4] }, // Green
    ];
    const userGrowthData = stats.userGrowth?.map(item => ({
        ...item,
        month: new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' })
    }));


    return (
      <div className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
                title="Total Users" 
                value={stats.totalUsers} 
                icon={FiUsers}
                color={{ border: "border-blue-500", text: "text-blue-600" }} 
            />
          <StatCard 
                title="Total Departments" 
                value={stats.totalDepartments} 
                icon={FiGlobe}
                color={{ border: "border-indigo-500", text: "text-indigo-600" }} 
            />
          <StatCard 
                title="Total Beds" 
                value={stats.beds.total} 
                icon={FaBed}
                color={{ border: "border-green-500", text: "text-green-600" }} 
            />
          <StatCard 
                title="Available Beds" 
                value={stats.beds.available} 
                icon={FiCheckCircle}
                color={{ border: "border-yellow-500", text: "text-yellow-600" }} 
            />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center col-span-1">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 w-full text-center">User Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={rolesData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                        {rolesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]}/>
                    <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: "10px" }}/>
                </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg xl:col-span-2">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">User Growth Over Time</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={userGrowthData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="month" tick={{ fill: '#6b7280' }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    name="New Users"
                    stroke="#2563eb"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg flex flex-col items-center col-span-1 xl:col-span-3">
            <h3 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2 w-full text-center">Bed Occupancy Status</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="name" tick={{ fill: '#6b7280' }} />
                    <YAxis tick={{ fill: '#6b7280' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Bed Count" radius={[10, 10, 0, 0]}>
                        {bedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FiUsers className="mr-2 text-blue-600" /> User Management & Subscriptions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sub Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Plan</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Screenshot</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(searchTerm ? filteredUsers : users).map((u) => (
              <tr key={u._id} className="hover:bg-indigo-50 transition-colors">
                <td className="flex items-center px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                  <img 
                  src={`${u.image}`} 
                  alt="profile"
                  className="rounded-full h-8 w-8 object-cover mr-3 border border-gray-200"
                  />
                  {u.name}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {getRoleName(role)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-bold text-sm`}>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${u.subscription?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {u.subscription?.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700">{u.subscription?.plan || "N/A"}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {u.subscription?.paymentScreenshot ? (
                    <a
                      href={u.subscription.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline flex items-center"
                    >
                        <FiClipboard className="mr-1" /> View
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {!u.subscription?.isActive ? (
                    <button
                      onClick={() => handleSubscriptionAction(u._id, "activate")}
                      className="flex items-center text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full text-xs disabled:opacity-50 transition-colors"
                      disabled={!u.subscription?.paymentScreenshot}
                    >
                        <FiCheckCircle className="mr-1" size={12} /> Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscriptionAction(u._id, "deactivate")}
                      className="flex items-center text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-xs transition-colors"
                    >
                        <FiXCircle className="mr-1" size={12} /> Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="flex items-center text-red-600 border border-red-600 bg-white hover:bg-red-600 hover:text-white px-3 py-1 rounded-full text-xs transition-colors mt-1"
                  >
                        <FiTrash2 className="mr-1" size={12} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDepartments = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center"><FiGlobe className="mr-2 text-indigo-600" /> Department & Structure Management</h2>
      <AddDepartmentForm onSuccess={loadData} />

      <div className="space-y-6">
        {(searchTerm ? filteredDepartments : departments).map((d) => (
          <div key={d._id} className="border border-gray-200 p-6 rounded-xl shadow-lg bg-gray-50 transition-shadow duration-300 hover:shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-3">
              <h3 className="text-xl font-extrabold text-indigo-700">{d.name}</h3>
              <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                <WardForm deptId={d._id} onAdd={loadData} handleAddWard={handleAddWard}/>
                <button
                  onClick={() => handleDeleteDepartment(d._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors shadow-sm flex items-center"
                >
                    <FiTrash2 className="mr-1" size={12} /> Dept
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {d.wards.map((ward) => (
                <div key={ward._id} className="p-4 bg-white rounded-lg shadow-md border border-gray-100">
                  <div className="flex justify-between items-start mb-2 border-b pb-2">
                    <span className="font-bold text-gray-700">{ward.name}</span>
                    <div className="flex flex-col items-end space-y-1">
                        <BedForm deptId={d._id} wardId={ward._id} onAdd={loadData} handleAddBed={handleAddBed} />
                        <button
                            onClick={() => handleDeleteWard(d._id, ward._id)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                            Delete Ward
                        </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 max-h-32 overflow-y-auto">
                    {ward.beds.map((bed) => (
                      <span
                        key={bed._id}
                        className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors hover:shadow-lg ${
                          bed.assignedUser
                            ? "bg-red-100 text-red-700 border border-red-300" 
                            : "bg-green-100 text-green-700 border border-green-300"
                        }`}
                        title={`Assigned: ${bed.assignedUser?.name || 'None'}. Click to delete.`}
                        onClick={() => handleDeleteBed(d._id, ward._id, bed._id)}
                      >
                        <FaBed className="inline-block mr-1" size={10} /> {bed.id}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl overflow-hidden">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FiClipboard className="mr-2 text-green-600" /> All Assignments</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">User</th>
              <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">Role</th>
              <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">Department</th>
              <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">Ward</th>
              <th className="px-6 py-3 text-left font-bold text-gray-600 uppercase">Beds</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(searchTerm ? filteredAssignments : assignments).map((a) => (
              <tr key={a._id} className="hover:bg-green-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{a.user?.name}</td>
                <td className="px-6 py-4 text-gray-600 font-medium">{getRoleName(a.user?.role)}</td>
                <td className="px-6 py-4 font-medium text-indigo-700">{a.department?.name}</td>
                <td className="px-6 py-4 text-gray-700">{a.ward || "N/A"}</td>
                <td className="px-6 py-4">
                  {/* The Bed List Chip Display */}
                  {Array.isArray(a.beds) && a.beds.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {a.beds.map((bedId, index) => (
                                <span 
                                    key={index} 
                                    className="px-3 py-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded-full shadow-sm flex items-center"
                                >
                                    <FaBed className="mr-1" size={10} /> {bedId}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <span className="text-gray-500 italic">No Beds</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FiBell className="mr-2 text-yellow-600" /> System Notifications</h2>
      <ul className="space-y-4">
        {(searchTerm ? filteredNotifications : notifications).map((n) => (
          <li key={n._id} className="p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50 hover:bg-white transition-colors">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-700 flex items-center">
                    <FiUsers className="mr-2" size={16} />
                {n.user?.name} ({getRoleName(n.user?.role)})
              </span>
              <span className="text-xs text-gray-500 font-medium">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="mt-2 text-gray-800 border-l-4 border-yellow-400 pl-3 py-1 bg-yellow-50 rounded-r-md">
                <span className="font-semibold">{n.message}</span>
            </p>
            {n.from && (
              <p className="text-sm text-gray-600 mt-2 pt-1 border-t border-gray-200">
                <span className="font-medium">Triggered By:</span> {n.from.name} ({getRoleName(n.from.role)})
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderSupport = () => {
    const handleMarkAsRead = async (msgId) => {
      try {
        await updateMessageReadStatus(msgId);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg._id === msgId ? { ...msg, read: true } : msg
          )
        );
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }

      return (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FiSend className="mr-2 text-blue-600" /> Send Refined Message</h2>
            <form onSubmit={handleSendSupport} className="space-y-4">
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Recipient Email"
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject"
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                rows="6"
                required
              />
              <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md disabled:bg-blue-400">
                {supportStatus.includes("Sending") ? "Sending..." : "Send Reply"}
              </button>
            </form>
            {supportStatus && <p className={`mt-4 text-center text-sm ${supportStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{supportStatus}</p>}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><FiMail className="mr-2 text-pink-600" /> Support Requests</h2>
            <ul className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {messages.map((msg) => (
                <li 
                    key={msg._id} 
                    className={`p-4 border rounded-xl shadow-sm transition-colors ${msg.read ? 'bg-gray-100' : 'bg-red-50 border-red-200'}`}
                >
                  <div className='flex justify-between items-center pb-2 border-b'>
                        <span className={`font-extrabold text-sm ${msg.from === user.email ? "text-blue-500" : "text-red-500"}`}>
                            {msg.from === user.email ? "SENT" : "INCOMING"}
                        </span>
                        {!msg.read && msg.from !== user.email && (
                            <button 
                                onClick={() => handleMarkAsRead(msg._id)} 
                                className="cp text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                            >
                                <FiCheckCircle className="mr-1" size={12} /> Mark as Read
                            </button>
                        )}
                    </div>
                  <p className="mt-2 text-gray-800">
                        <span className="font-bold">{msg.subject}</span>: {msg.message}
                    </p>
                  <p className='text-sm text-gray-600 mt-2'>
                        <span className='font-medium'>From:</span> {msg.from}
                    </p>
                    <p className='text-sm text-gray-600'>
                        <span className='font-medium'>To:</span> {msg.to}
                    </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
};

  return (
    user?.role === "admin" && (
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-800 mb-8 border-b-4 border-blue-600 pb-3 flex items-center">
          <FiActivity className="mr-3 text-blue-600" /> BNS Admin Control Panel
        </h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          {[
            { key: "dashboard", label: "Dashboard", icon: FiActivity },
            { key: "users", label: "User Management", icon: FiUsers },
            { key: "departments", label: "Structure", icon: FiGlobe },
            { key: "assignments", label: "Assignments", icon: FiClipboard },
            { key: "notifications", label: "Notifications", icon: FiBell },
            { key: "support", label: "Support", icon: FiMail },
            { key: "role-requests", label: "Role Requests", icon: FiUserCheck },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`cursor-pointer flex items-center px-4 py-2 md:px-6 md:py-3 font-semibold text-sm rounded-lg transition-all duration-200 ${
                tab === item.key
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 bg-white hover:bg-blue-50 hover:text-blue-600 border border-gray-200"
              }`}
            >
              <item.icon className="mr-2" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        {tab !== "dashboard" && tab !== "support" && tab !== "role-requests" && (
          <div className="mb-8">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onSearchClick={() => {}}
              placeholder={`Search ${tab} by user name or email...`}
            />
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="text-center py-20 flex flex-col items-center justify-center bg-white rounded-xl shadow-lg">
            <FaSpinner className="text-6xl text-blue-500 mb-4 animate-spin" />
            <div className="text-2xl font-semibold text-gray-700">
              Loading data...
            </div>
          </div>
        )}

        {!loading && (
          <div className="container mx-auto max-w-7xl">
            {tab === "dashboard" && renderDashboard()}
            {tab === "users" && renderUsers()}
            {tab === "departments" && renderDepartments()}
            {tab === "assignments" && renderAssignments()}
            {tab === "notifications" && renderNotifications()}
            {tab === "support" && renderSupport()}
            {tab === "role-requests" && renderRoleRequests()}
          </div>
        )}
      </div>
    )
  );
};

export default MainAdmin;