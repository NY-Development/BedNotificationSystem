import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  activateAIAccess,
  deactivateAIAccess,
  addWard,
  deleteWard,
  addBed,
  deleteBed,
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
import ConfirmModal from "../components/ConfirmModal";

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
    FiXCircle,
    FiPlus,
    FiCpu
} from 'react-icons/fi';
import {Sparkles} from 'lucide-react'
import { FaBed, FaSpinner } from 'react-icons/fa';

// --- Constants ---
const USER_ROLES = ["c1", "c2", "intern", "supervisor", "admin"];
const PIE_COLORS = ["#4F46E5", "#00C4FF", "#FFBB28", "#EF4444", "#10B981"];

const getRoleName = (role) => {
  const roles = {
    c1: "Clinical Year I",
    c2: "Clinical Year II",
    intern: "Intern",
    supervisor: "Supervisor",
    admin: "Admin"
  };
  return roles[role] || "User";
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
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Support Form State
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [supportStatus, setSupportStatus] = useState("");

  // ---- Load Data ----
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      switch (tab) {
        case "dashboard":
          const statsRes = await getStats();
          setStats(statsRes);
          break;
        case "users":
          setUsers(await getAllUsers());
          break;
        case "departments":
          setDepartments(await getAllDepartments());
          break;
        case "support":
          setMessages(await getMessages());
          break;
        case "assignments":
          setAssignments(await getAllAssignments());
          break;
        case "notifications":
          setNotifications(await getAllNotifications());
          break;
        case "role-requests":
          const reqRes = await getRoleChangeRequests();
          setRoleRequests(reqRes.requests || []);
          break;
        default:
          break;
      }
    } catch (error) {
      toast.error(`Error loading ${tab} data`);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ---- Logic: Real-time Search Filtering ----
  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return { users, departments, assignments, notifications };

    return {
      users: users.filter(u => u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term) || u.phone?.includes(term)),
      assignments: assignments.filter(a => a.user?.name?.toLowerCase().includes(term) || a.user?.email?.toLowerCase().includes(term) || a.department?.name?.toLowerCase().includes(term)),
      notifications: notifications.filter(n => n.user?.name?.toLowerCase().includes(term) || n.message?.toLowerCase().includes(term)),
      departments: departments.filter(d => d.name?.toLowerCase().includes(term) || d.wards.some(w => w.name?.toLowerCase().includes(term)))
    };
  }, [searchTerm, users, departments, assignments, notifications]);

  // ---- Actions ----
  const openConfirm = (title, message, onConfirm) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success("Role updated successfully");
      loadData();
    } catch { toast.error("Failed to update role"); }
  };

  const handleSubscriptionAction = async (userId, action) => {
    try {
      action === "activate" ? await activateSubscription(userId) : await deactivateSubscription(userId);
      toast.success(`Subscription ${action}d`);
      loadData();
    } catch { toast.error("Update failed"); }
  };

  const handleAIAction = async (userId, action) => {
    try {
      action === "activate" ? await activateAIAccess(userId) : await deactivateAIAccess(userId);
      toast.success(`AI Access ${action}d`);
      loadData();
    } catch (err) {
      toast.error(err.message || "AI update failed");
    }
  };

  const handleAddWard = async (deptId, wardName) => {
    await addWard(deptId, { name: wardName });
    toast.success("Ward added");
    loadData();
  };

  const handleAddBed = async (deptId, wardId, bedId) => {
    await addBed(deptId, wardId, { id: bedId });
    toast.success("Bed added");
    loadData();
  };

  const handleSendSupport = async (e) => {
    e.preventDefault();
    setSupportStatus("Sending...");
    try {
      await sendRefinedMessage({ recipient, subject, message });
      setSupportStatus("Message sent successfully");
      setRecipient(""); setSubject(""); setMessage("");
      loadData();
    } catch { setSupportStatus("Failed to send"); }
  };

  // ---- Sub-Component Forms ----
  const AddDepartmentForm = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        await addDepartment({ name });
        toast.success("Department created");
        setName("");
        onSuccess();
      } catch { toast.error("Error creating department"); }
    };
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New Department Name" className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500" required />
        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
            <FiPlus className="mr-2" /> Add Department
        </button>
      </form>
    );
  };

  const WardForm = ({ deptId }) => {
    const [wardName, setWardName] = useState("");
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleAddWard(deptId, wardName); setWardName(""); }} className="flex gap-2">
        <input value={wardName} onChange={(e) => setWardName(e.target.value)} placeholder="New Ward" className="p-2 border rounded-lg text-sm" required />
        <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700">Add</button>
      </form>
    );
  };

  const BedForm = ({ deptId, wardId }) => {
    const [bedId, setBedId] = useState("");
    return (
      <form onSubmit={(e) => { e.preventDefault(); handleAddBed(deptId, wardId, bedId); setBedId(""); }} className="flex gap-1">
        <input value={bedId} onChange={(e) => setBedId(e.target.value)} placeholder="ID" className="w-16 p-1 border rounded-lg text-xs" required />
        <button type="submit" className="px-2 py-1 bg-indigo-500 text-white rounded-full text-xs">+</button>
      </form>
    );
  };

  // ---- Renderers ----
  const renderDashboard = () => {
    if (!stats) return null;
    const rolesData = stats.rolesCount.map(r => ({ name: getRoleName(r._id), value: r.count }));
    const bedData = [
      { name: "Occupied", value: stats.beds.occupied, fill: "#EF4444" },
      { name: "Available", value: stats.beds.available, fill: "#10B981" },
    ];
    const userGrowthData = stats.userGrowth?.map(item => ({
        ...item, month: new Date(item.month).toLocaleString('default', { month: 'short', year: 'numeric' })
    }));

    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers} icon={FiUsers} color="blue" />
          <StatCard title="Departments" value={stats.totalDepartments} icon={FiGlobe} color="indigo" />
          <StatCard title="Total Beds" value={stats.beds.total} icon={FaBed} color="green" />
          <StatCard title="Available" value={stats.beds.available} icon={FiCheckCircle} color="yellow" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col items-center">
            <h3 className="text-lg font-bold mb-4 text-gray-700">Role Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={rolesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {rolesData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 xl:col-span-2">
            <h3 className="text-lg font-bold mb-4 text-gray-700">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md border border-gray-100 xl:col-span-3">
            <h3 className="text-lg font-bold mb-4 text-gray-700 text-center">Bed Occupancy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className={`p-6 bg-white rounded-2xl shadow-sm border-b-4 border-${color}-500 hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <Icon className={`text-2xl text-${color}-600`} />
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-3xl font-black mt-2 text-gray-800">{value}</p>
    </div>
  );

const renderUsers = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center text-gray-800">
          <FiUsers className="mr-2 text-blue-600" /> User Directory
        </h2>
        <span className="text-sm font-medium text-gray-500">
          {filteredData.users.length} Users found
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subs Stat</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Subs Proof</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">AI Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">AI Proof</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">AI Actions</th>
              <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase">Account</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.users.map((u) => (
              <tr key={u._id} className="hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center">
                    <img src={u.image} alt="" className="h-10 w-10 rounded-full border-2 border-white shadow-sm mr-3" />
                    <div>
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-[10px] text-gray-500">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select 
                    value={u.role} 
                    onChange={(e) => handleRoleChange(u._id, e.target.value)} 
                    className="text-xs border rounded-md p-1 bg-white"
                  >
                    {USER_ROLES.map(r => <option key={r} value={r}>{getRoleName(r)}</option>)}
                  </select>
                </td>
                {/* Main Subscription */}
                <td className="px-4 py-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${u.subscription?.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {u.subscription?.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </td>
                {/* Platform Proof Column */}
                <td className="px-4 py-4">
                  {u.subscription?.paymentScreenshot ? (
                    <a href={u.subscription.paymentScreenshot} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 font-bold hover:underline flex items-center">
                      <FiClipboard className="mr-1" /> View Platform
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-400">No Proof</span>
                  )}
                </td>
                {/* AI Status */}
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-black ${u.aiAccess?.isActive ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
                      {u.aiAccess?.isActive ? "AI ACTIVE" : "NO AI"}
                    </span>
                    {u.aiAccess?.status === "pending" && (
                      <span className="text-[9px] font-bold text-orange-500 animate-pulse">PENDING APPROVAL</span>
                    )}
                  </div>
                </td>
                {/* AI Proof Column (New Placement) */}
                <td className="px-4 py-4">
                  {u.aiAccess?.paymentScreenshot ? (
                    <a href={u.aiAccess.paymentScreenshot} target="_blank" rel="noreferrer" className="text-[10px] text-purple-600 font-bold hover:underline flex items-center">
                      <Sparkles size={10} className="mr-1" /> View AI ({u.aiAccess.plan || 'N/A'})
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-400">No AI Proof</span>
                  )}
                </td>
                {/* AI Actions */}
                <td className="px-4 py-4">
                  <button 
                    onClick={() => handleAIAction(u._id, u.aiAccess?.isActive ? "deactivate" : "activate")}
                    className={`cp flex items-center px-2 py-1 rounded text-[10px] font-bold text-white transition-colors ${u.aiAccess?.isActive ? "bg-orange-500 hover:bg-orange-600" : "bg-indigo-600 hover:bg-indigo-700"}`}
                  >
                    {u.aiAccess?.isActive ? <><FiXCircle className="mr-1" /> Revoke</> : <><FiCheckCircle className="mr-1" /> Grant AI</>}
                  </button>
                </td>
                <td className="px-4 py-4 text-right space-x-2">
                  <button onClick={() => handleSubscriptionAction(u._id, u.subscription?.isActive ? "deactivate" : "activate")} className={`p-1.5 rounded-full transition-colors ${u.subscription?.isActive ? "text-orange-500 hover:bg-orange-50" : "text-green-500 hover:bg-green-50"}`}>
                    {u.subscription?.isActive ? <FiXCircle size={16} /> : <FiCheckCircle size={16} />}
                  </button>
                  <button onClick={() => openConfirm("Delete User", `Permanently delete ${u.name}?`, () => deleteUser(u._id).then(loadData))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-full">
                    <FiTrash2 size={16} />
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
    <div className="bg-white p-6 rounded-2xl shadow-xl space-y-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center"><FiGlobe className="mr-2 text-indigo-600" /> Structure Management</h2>
      <AddDepartmentForm onSuccess={loadData} />
      <div className="grid gap-6">
        {filteredData.departments.map((d) => (
          <div key={d._id} className="border border-gray-200 p-5 rounded-2xl bg-gray-50/50">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h3 className="text-xl font-black text-indigo-800">{d.name}</h3>
              <div className="flex items-center gap-4">
                <WardForm deptId={d._id} />
                <button onClick={() => openConfirm("Delete Dept", "This will remove all wards and beds.", () => deleteDepartment(d._id).then(loadData))} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {d.wards.map((ward) => (
                <div key={ward._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-bold text-gray-700">{ward.name}</span>
                    <button onClick={() => openConfirm("Delete Ward", "Remove this ward?", () => deleteWard(d._id, ward._id).then(loadData))} className="text-[10px] text-red-400 hover:text-red-600 font-bold uppercase tracking-tighter">Remove</button>
                  </div>
                  <div className="space-y-3">
                    <BedForm deptId={d._id} wardId={ward._id} />
                    <div className="flex flex-wrap gap-2">
                        {ward.beds.map(bed => (
                            <span key={bed._id} onClick={() => openConfirm("Delete Bed", "Remove this bed?", () => deleteBed(d._id, ward._id, bed._id).then(loadData))} className={`px-2 py-1 text-[10px] font-bold rounded-lg cursor-pointer flex items-center gap-1 ${bed.assignedUser ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
                                <FaBed size={10} /> {bed.id}
                            </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssignments = () => {
    const today = new Date();
    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-6 border-b"><h2 className="text-xl font-bold flex items-center text-gray-800"><FiClipboard className="mr-2 text-green-600" /> Active Assignments</h2></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User / Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Beds</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Expiry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.assignments.map((a) => (
                <tr key={a._id} className="hover:bg-green-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-800">{a.user?.name}</div>
                    <div className="text-[10px] font-bold text-indigo-500 uppercase">{getRoleName(a.user?.role)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium">{a.department?.name}</div>
                    <div className="text-xs text-gray-500">{a.ward || "No Ward"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {a.beds?.map((b, i) => <span key={i} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] rounded font-bold border border-indigo-100">{b}</span>) || <span className="text-xs text-gray-400">None</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    <div className={new Date(a.deptExpiry) < today ? "text-red-500 font-bold" : "text-gray-600"}>D: {new Date(a.deptExpiry).toLocaleDateString()}</div>
                    <div className={new Date(a.wardExpiry) < today ? "text-red-500 font-bold" : "text-gray-600"}>W: {new Date(a.wardExpiry).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNotifications = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 flex items-center"><FiBell className="mr-2 text-yellow-500" /> System Activity Log</h2>
      <div className="space-y-4">
        {filteredData.notifications.map((n) => (
          <div key={n._id} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="mt-1"><FiActivity className="text-yellow-600" /></div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-indigo-900">{n.user?.name}</span>
                    <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                {n.from && <div className="mt-2 text-[10px] text-gray-500 italic">Triggered by: {n.from.name}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center"><FiSend className="mr-2 text-blue-600" /> Compose Message</h2>
        <form onSubmit={handleSendSupport} className="space-y-4">
          <input value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="Recipient Email" className="w-full p-3 border rounded-xl" required />
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="w-full p-3 border rounded-xl" required />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message Body" rows="5" className="w-full p-3 border rounded-xl" required />
          <button type="submit" disabled={supportStatus === "Sending..."} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all">{supportStatus || "Send Message"}</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col">
        <h2 className="text-xl font-bold mb-6 flex items-center"><FiMail className="mr-2 text-pink-500" /> Message History</h2>
        <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
            {messages.map(msg => (
                <div key={msg._id} className={`p-4 rounded-2xl border ${msg.read ? "bg-gray-50 border-gray-100" : "bg-red-50 border-red-100"}`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] font-black uppercase text-indigo-600">{msg.from === user.email ? "Sent" : "Received"}</span>
                        {!msg.read && msg.from !== user.email && <button onClick={() => updateMessageReadStatus(msg._id).then(loadData)} className="text-[10px] font-bold text-blue-600 hover:underline">Mark Read</button>}
                    </div>
                    <div className="font-bold text-sm mb-1">{msg.subject}</div>
                    <p className="text-xs text-gray-600 leading-relaxed">{msg.message}</p>
                    <div className="mt-3 text-[9px] text-gray-400 font-bold uppercase">{msg.from === user.email ? `To: ${msg.to}` : `From: ${msg.from}`}</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderRoleRequests = () => (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
        <h2 className="text-xl font-bold mb-6 flex items-center"><FiUserCheck className="mr-2 text-purple-600" /> Verification Requests</h2>
        {roleRequests.length === 0 ? <p className="text-center py-10 text-gray-400 font-medium">No pending role change requests</p> : (
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase text-gray-500">Applicant</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase text-gray-500">Requested Role</th>
                            <th className="px-6 py-3 text-right text-[10px] font-black uppercase text-gray-500">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {roleRequests.map(req => (
                            <tr key={req._id}>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-gray-800">{req.name}</div>
                                    <div className="text-xs text-gray-500">{req.email}</div>
                                </td>
                                <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg border border-purple-100 uppercase">{getRoleName(req.roleChangeRequest?.role)}</span></td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => handleRoleChange(req._id, req.roleChangeRequest.role)} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700">Approve</button>
                                    <button onClick={() => handleRoleChange(req._id, "intern")} className="bg-white text-red-600 border border-red-200 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-50">Deny</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );

  if (user?.role !== "admin") return null;

  return (
    <div className="p-4 md:p-8 bg-gray-50/50 min-h-screen">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-black text-gray-800 flex items-center">
          <FiActivity className="mr-3 text-indigo-600" /> BNS Dashboard
        </h1>
        <div className="text-xs font-bold bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-gray-500 uppercase tracking-widest">
            Logged in as <span className="text-indigo-600">{user.name}</span>
        </div>
      </header>

      <nav className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        {[
          { id: "dashboard", label: "Dashboard", icon: FiActivity },
          { id: "users", label: "Users", icon: FiUsers },
          { id: "departments", label: "Structure", icon: FiGlobe },
          { id: "assignments", label: "Assignments", icon: FiClipboard },
          { id: "notifications", label: "Activity", icon: FiBell },
          { id: "support", label: "Messages", icon: FiMail },
          { id: "role-requests", label: "Verifications", icon: FiUserCheck },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSearchTerm(""); }}
            className={`flex items-center px-4 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${tab === t.id ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 scale-105" : "text-gray-500 hover:bg-gray-50"}`}
          >
            <t.icon className="mr-2" /> {t.label}
          </button>
        ))}
      </nav>

      {tab !== "dashboard" && tab !== "support" && tab !== "role-requests" && (
        <div className="mb-8 max-w-2xl">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} placeholder={`Filter through ${tab}...`} />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <FaSpinner className="text-4xl text-indigo-600 animate-spin mb-4" />
          <p className="font-black text-gray-400 uppercase tracking-widest">Syncing Data...</p>
        </div>
      ) : (
        <main className="max-w-7xl mx-auto pb-20">
          {tab === "dashboard" && renderDashboard()}
          {tab === "users" && renderUsers()}
          {tab === "departments" && renderDepartments()}
          {tab === "assignments" && renderAssignments()}
          {tab === "notifications" && renderNotifications()}
          {tab === "support" && renderSupport()}
          {tab === "role-requests" && renderRoleRequests()}
        </main>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={() => { confirmModal.onConfirm?.(); setConfirmModal({ ...confirmModal, isOpen: false }); }}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      />
    </div>
  );
};

export default MainAdmin;