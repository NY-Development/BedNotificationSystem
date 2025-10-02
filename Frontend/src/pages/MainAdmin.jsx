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
  ResponsiveContainer
} from "recharts";
import { useAuth } from "../context/AuthContext";

// --- Constants ---
const USER_ROLES = ["c1", "c2", "intern", "supervisor", "admin"]; // Define all possible roles
const PIE_COLORS = ["01088FE", "#00C4FF", "#FFBB28", "#FF8042", "00FF00"];

// --- Components for Modularity ---

const StatCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-xl shadow-lg border-l-4 ${color}`}>
    <p className="text-sm font-medium text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

const AddDepartmentForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Adding...");
    try {
      await addDepartment(name);
      setStatus("Department added!");
      setName("");
      onSuccess();
    } catch (err) {
      setStatus("Failed to add department.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg bg-gray-50 space-y-3">
      <h3 className="text-lg font-semibold">Add New Department</h3>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Department Name"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Add Department
      </button>
      {status && <p className="text-sm text-gray-600">{status}</p>}
    </form>
  );
};

// Main Component
const MainAdmin = () => {
  const [tab, setTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [supportStatus, setSupportStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const {user} = useAuth();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (tab === "dashboard") {
        const statsRes = await getStats();
        setStats(statsRes);
      } else if (tab === "users") {
        const usersRes = await getAllUsers();
        setUsers(usersRes);
      } else if (tab === "departments") {
        const deptRes = await getAllDepartments();
        setDepartments(deptRes);
      } else if (tab === "support") {
        const msg = await getMessages();
        setMessages(msg);
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

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user and all associated data?")) {
      try {
        await deleteUser(id);
        loadData();
      } catch (error) {
        alert("Failed to delete user.");
      }
    }
  };

  const handleSubscriptionAction = async (userId, action) => {
    try {
      if (action === "activate") {
        await activateSubscription(userId);
      } else {
        await deactivateSubscription(userId);
      }
      loadData();
    } catch (error) {
      alert(`Failed to ${action} subscription.`);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserData(userId, newRole);
      loadData();
    } catch (error) {
      alert("Failed to update user role.");
    }
  };

  const handleDeleteDepartment = async (deptId) => {
    if (window.confirm("Delete department? This cannot be undone.")) {
      try {
        await deleteDepartment(deptId);
        loadData();
      } catch (error) {
        alert("Failed to delete department.");
      }
    }
  };

  const handleAddWard = async (deptId, wardName) => {
    if (!wardName.trim()) return;
    try {
        await addWard(deptId, wardName);
        loadData();
    } catch (error) {
        alert("Failed to add ward.");
    }
  };

  const handleDeleteWard = async (deptId, wardId) => {
    if (window.confirm("Delete ward?")) {
        try {
            await deleteWard(deptId, wardId);
            loadData();
        } catch (error) {
            alert("Failed to delete ward.");
        }
    }
  };

  const handleAddBed = async (deptId, wardId, bedId) => {
    if (!bedId.trim()) return;
    try {
        await addBed(deptId, wardId, { id: bedId });
        loadData();
    } catch (error) {
        alert("Failed to add bed.");
    }
  };

  const handleDeleteBed = async (deptId, wardId, bedId) => {
    if (window.confirm("Delete bed?")) {
        try {
            await deleteBed(deptId, wardId, bedId);
            loadData();
        } catch (error) {
            alert("Failed to delete bed.");
        }
    }
  };

  const handleSendSupport = async (e) => {
    e.preventDefault();
    setSupportStatus("Sending...");
    try {
      await sendRefinedMessage({ recipient, subject, message });
      setSupportStatus("Message sent successfully!");
      setRecipient("");
      setSubject("");
      setMessage("");
    } catch (err) {
      setSupportStatus("Failed to send message.");
    }
  };

  const renderDashboard = () => {
    if (!stats) return <p className="text-center text-gray-500">Loading statistics...</p>;

    const rolesData = stats.rolesCount.map(r => ({ name: r._id, value: r.count }));
    const bedData = [
      { name: "Occupied Beds", value: stats.beds.occupied },
      { name: "Available Beds", value: stats.beds.available },
    ];

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} color="border-blue-500 bg-blue-50" />
          <StatCard title="Total Departments" value={stats.totalDepartments} color="border-indigo-500 bg-purple-50" />
          <StatCard title="Total Beds" value={stats.beds.total} color="border-green-500 bg-green-50" />
          <StatCard title="Available Beds" value={stats.beds.available} color="border-yellow-500 bg-yellow-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 bg-white rounded-xl shadow-lg">
          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">User Role Distribution</h3>
            <PieChart width={400} height={300}>
              <Pie
                data={rolesData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {rolesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4">User Growth Over Time</h3>
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats.userGrowth || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563eb"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xl font-semibold mb-4">Bed Occupancy Status</h3>
            <BarChart width={400} height={300} data={bedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value">
                {bedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </div>
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">User Management & Subscriptions</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sub Status</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Screenshot</th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                <td className="flex px-4 sm:px-6 py-4 whitespace-nowrap font-medium text-gray-800 justify-center items-center">
                  <img 
                  src={`${u.image}`} 
                  alt="profile image"
                  className="rounded-full h-10 w-10 mr-2"
                  />
                  {u.name}
                  </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-600">{u.email}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="p-1 border rounded-md text-sm bg-gray-50"
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role === u.role && role}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={`px-4 sm:px-6 py-4 whitespace-nowrap font-semibold ${u.subscription?.isActive ? "text-green-600" : "text-red-600"}`}>
                  {u.subscription?.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-gray-700">{u.subscription?.plan || "N/A"}</td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                  {u.subscription?.paymentScreenshot ? (
                    <a
                      href={u.subscription.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      View Screenshot
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {!u.subscription?.isActive ? (
                    <button
                      onClick={() => handleSubscriptionAction(u._id, "activate")}
                      className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded-full text-xs disabled:opacity-50"
                      disabled={!u.subscription?.paymentScreenshot}
                    >
                      Activate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscriptionAction(u._id, "deactivate")}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-full text-xs"
                    >
                      Deactivate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded-full text-xs"
                  >
                    Delete
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
    <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-xl font-semibold">Department & Structure Management</h2>
      <AddDepartmentForm onSuccess={loadData} />

      <div className="space-y-4">
        {departments.map((d) => (
          <div key={d._id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">{d.name}</h3>
              <div className="space-x-2">
                <WardForm deptId={d._id} onAdd={loadData} />
                <button
                  onClick={() => handleDeleteDepartment(d._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete Dept
                </button>
              </div>
            </div>

            <div className="space-y-3 pl-4 border-l-2 border-gray-200">
              {d.wards.map((ward) => (
                <div key={ward._id} className="p-3 bg-white rounded-md shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{ward.name}</span>
                    <div className="space-x-2">
                        <BedForm deptId={d._id} wardId={ward._id} onAdd={loadData} />
                        <button
                            onClick={() => handleDeleteWard(d._id, ward._id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                        >
                            Delete Ward
                        </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t mt-2">
                    {ward.beds.map((bed) => (
                      <span
                        key={bed._id}
                        className={`px-3 py-1 text-xs rounded-full cursor-pointer transition-colors ${
                          bed.status === "occupied" ? "bg-red-200 text-red-800" : "bg-green-200 text-green-800"
                        }`}
                        title={`Assigned: ${bed.assignedUser?.name || 'None'}`}
                        onClick={() => handleDeleteBed(d._id, ward._id, bed._id)}
                      >
                        {bed.id}
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

  const renderSupport = () => (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mb-6">
        <h2 className="text-xl text-black font-semibold mb-4">Support Requests</h2>
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg._id} className="p-4 border rounded-lg">
              <strong>{msg.subject}</strong>: {msg.message} <br />
              <em>From: {msg.from}</em>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Reply to Support Messages (Refined Message)</h2>
        <form onSubmit={handleSendSupport} className="space-y-4">
          <input
            type="email"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="Recipient Email"
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your Message"
            className="w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows="6"
            required
          />
          <button type="submit" className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-150">
            Send Reply
          </button>
        </form>
        {supportStatus && <p className={`mt-4 text-center text-sm ${supportStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{supportStatus}</p>}
      </div>
    </div>
  );

  // --- Inline Forms for Subcomponents ---
  const WardForm = ({ deptId, onAdd }) => {
    const [name, setName] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddWard(deptId, name).then(() => {
        setName('');
        setIsAdding(false);
        onAdd();
      });
    };

    return isAdding ? (
      <form onSubmit={handleSubmit} className="inline-flex space-x-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ward Name"
          className="p-1 border rounded text-sm w-32"
          required
        />
        <button type="submit" className="px-2 py-1 bg-green-500 text-white rounded text-xs">Add</button>
        <button type="button" onClick={() => setIsAdding(false)} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">Cancel</button>
      </form>
    ) : (
      <button onClick={() => setIsAdding(true)} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
        + Ward
      </button>
    );
  };

  const BedForm = ({ deptId, wardId, onAdd }) => {
    const [id, setId] = useState('');
    const [isAdding, setIsAdding] = useState(false);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleAddBed(deptId, wardId, id).then(() => {
        setId('');
        setIsAdding(false);
        onAdd();
      });
    };

    return isAdding ? (
      <form onSubmit={handleSubmit} className="inline-flex space-x-2">
        <input
          type="text"
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="Bed ID (e.g., 101)"
          className="p-1 border rounded text-xs w-24"
          required
        />
        <button type="submit" className="px-2 py-1 bg-blue-500 text-white rounded text-xs">Add</button>
        <button type="button" onClick={() => setIsAdding(false)} className="px-2 py-1 bg-gray-500 text-white rounded text-xs">Cancel</button>
      </form>
    ) : (
      <button onClick={() => setIsAdding(true)} className="text-blue-500 hover:text-blue-700 text-xs">
        + Bed
      </button>
    );
  };
  return (
    user?.role === 'admin' && (
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 border-b pb-3">BNS Admin Dashboard</h1>

        {/* Tabs / Navigation */}
        <div className="flex flex-col md:flex-row gap-2 mb-8 border-b border-gray-300">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "users", label: "User Management" },
            { key: "departments", label: "Structure Management" },
            { key: "support", label: "Support Replies" },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`cursor-pointer flex-1 px-6 py-3 font-medium transition-colors duration-150 ${
                tab === item.key
                  ? "border-b-4 border-blue-600 text-blue-600 bg-white shadow-sm"
                  : "text-gray-600 hover:text-blue-500"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {loading && <div className="text-center text-lg py-10">Loading data...</div>}
        {!loading && (
          <div className="container mx-auto">
            {tab === "dashboard" && renderDashboard()}
            {tab === "users" && renderUsers()}
            {tab === "departments" && renderDepartments()}
            {tab === "support" && renderSupport()}
          </div>
        )}
      </div>
    )
  );
};

export default MainAdmin;