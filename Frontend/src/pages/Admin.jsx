import React, { useState, useEffect } from "react";
import { useSupervisor } from "../context/SupervisorContext";
import ConfirmModal from "../components/ConfirmModal";
import GoBack from "../components/GoBack";
import { Hospital, Bed, Users, Plus, Trash2, LayoutList, ShieldAlert, Layers } from "lucide-react";
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

  useEffect(() => { loadDepartments(); }, []);

  useEffect(() => {
    if (activeTab === "users") loadUsers();
  }, [activeTab]);

  const loadUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      toast.error("Failed to load user database");
    }
  };

  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({ title, message, onConfirm });
    setConfirmOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Initializing Admin Terminal...</p>
        </div>
      </div>
    );
  }

  if (!user?.subscription?.isActive) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-12 text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-xl">
          <ShieldAlert size={64} className="text-rose-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-4">Access Denied</h2>
          <p className="text-slate-500 font-bold mb-8 uppercase text-[10px] tracking-widest">Supervisor privileges required</p>
          <Link to="/login" className="block py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Authenticate</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><GoBack /></div>

        {/* Operational Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-8 mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
              <Layers size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Infrastructure</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">Supervisor Panel</h1>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { id: "departments", label: "Facility Assets", icon: Hospital },
              { id: "users", label: "User Database", icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cp flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Departments & Infrastructure */}
        {activeTab === "departments" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Department Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-2">
                  <Plus size={14} /> Registry: New Department
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="ENTER DEPT NAME"
                    className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    onClick={() => { if (newDeptName.trim()) { createDepartment(newDeptName.trim()); setNewDeptName(""); } }}
                    className="p-4 bg-indigo-600 text-white rounded-xl hover:bg-slate-900 transition-all shadow-md"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Department Feed */}
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div
                    key={dept._id}
                    onClick={() => { setSelectedDept(dept); setSelectedWard(null); }}
                    className={`group cp p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                      selectedDept?._id === dept._id 
                      ? "bg-white border-indigo-600 shadow-lg" 
                      : "bg-white border-transparent hover:border-slate-200"
                    }`}
                  >
                    <div>
                      <h4 className="font-black text-slate-900 italic uppercase tracking-tighter">{dept.name}</h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        Capacity: {dept.wards.length} Wards
                      </p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openConfirm("Decommission", `Purge ${dept.name}?`, () => removeDepartment(dept._id));
                      }}
                      className="cp opacity-100 p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Ward & Bed Context (Drill Down) */}
            <div className="lg:col-span-7">
              {selectedDept ? (
                <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm min-h-[400px]">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">{selectedDept.name}</h2>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Active Sector Configuration</p>
                    </div>
                  </div>

                  {/* Ward Entry */}
                  <div className="mb-10">
                    <div className="flex gap-2 mb-6">
                      <input
                        type="text"
                        value={newWardName}
                        onChange={(e) => setNewWardName(e.target.value)}
                        placeholder="ADD WARD TO SECTOR"
                        className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold uppercase tracking-tight focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        onClick={() => { if (newWardName.trim()) { createWard(selectedDept._id, newWardName.trim()); setNewWardName(""); } }}
                        className="cp py-4 px-6 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-md"
                      >
                        Deploy Ward
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedDept.wards.map((ward) => (
                        <div
                          key={ward._id}
                          onClick={() => setSelectedWard(ward)}
                          className={`cp p-4 rounded-2xl border-2 transition-all flex flex-col gap-3 ${
                            selectedWard?._id === ward._id ? "bg-emerald-50 border-emerald-500 shadow-md" : "bg-white border-slate-100"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span className="cp font-black text-slate-900 uppercase text-xs italic">{ward.name}</span>
                            <button onClick={() => removeWardById(selectedDept._id, ward._id)} className="cp text-rose-400 hover:text-rose-600">
                              <Trash2 size={12} />
                            </button>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ward.beds.length} Active Units</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bed Configuration */}
                  {selectedWard && (
                    <div className="pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-top-4">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 italic">
                        Units: {selectedWard.name}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                        {selectedWard.beds.map((bed) => (
                          <div key={bed._id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bed size={12} className={bed.status === "occupied" ? "text-rose-500" : "text-emerald-500"} />
                              <span className="text-[10px] font-black text-slate-700">{bed.id}</span>
                            </div>
                            <button onClick={() => removeBedById(selectedDept._id, selectedWard._id, bed._id)} className="text-slate-300 hover:text-rose-500 transition-all">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newBedId}
                          onChange={(e) => setNewBedId(e.target.value)}
                          placeholder="UNIT ID"
                          className="bg-slate-100 border-none rounded-lg px-3 text-[10px] font-black uppercase tracking-tight flex-1"
                        />
                        <button
                          onClick={() => { if (newBedId.trim()) { createBed(selectedDept._id, selectedWard._id, newBedId.trim()); setNewBedId(""); } }}
                          className="cp p-2.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-300">
                  <LayoutList size={48} strokeWidth={1} className="mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">Select Department to view Infrastructure</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Users */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Personnel", "Terminal Access", "Authorization", "Subscription", "Expiry"].map((h) => (
                      <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-all group">
                      <td className="px-8 py-5 font-black text-slate-900 italic uppercase text-sm tracking-tight">{u.name}</td>
                      <td className="px-8 py-5 font-bold text-slate-500 text-xs">{u.email}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${u?.subscription?.isActive ? 'text-emerald-500' : 'text-rose-400'}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${u?.subscription?.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`}></div>
                          {u?.subscription?.isActive ? 'Active' : 'Expired'}
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-slate-400 text-xs">{u?.subscription?.endDate || '---'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={confirmOpen}
          title={confirmData.title}
          message={confirmData.message}
          onConfirm={confirmData.onConfirm}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default Admin;