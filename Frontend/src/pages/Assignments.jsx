import React, { useEffect, useState } from "react";
import { createAssignment, updateAssignment } from "../services/assignment";
import { getDepartments } from "../services/department";
import { toast } from "react-hot-toast";
import { useBed } from "../context/BedContext";
import { useAuth } from "../context/AuthContext";
import { useAssignment } from "../context/AssignmentContext";
import { 
  ClipboardList, 
  Stethoscope, 
  Calendar, 
  BedDouble, 
  AlertCircle,
  ChevronRight,
  Activity
} from "lucide-react";

const Assignments = ({ closeModal, updateAssign = false, onFirstAssignmentComplete }) => {
  const { loadDepartments } = useBed();
  const { user } = useAuth();
  const { userAssign, getUserAssignment } = useAssignment();

  const [msg, setMsg] = useState('');
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    deptId: "",
    wardName: "",
    beds: [],
    deptExpiry: "",
    wardExpiry: "",
  });
  const [loading, setLoading] = useState(false);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  useEffect(() => {
    const fetchAssignments = async () => {
      setLoading(true);
      try {
        if (user) {
          await getUserAssignment();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [user]);

  useEffect(() => {
    if (updateAssign) {
      setMsg('PROTOCOL OVERRIDE: Updating here will terminate all previous clinical assignments.');
    } else {
      setMsg('');
    }
  }, [updateAssign]);

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, [user]);

  const handleDeptChange = (e) => {
    setForm({ ...form, deptId: e.target.value, wardName: "", beds: [] });
  };

  const handleWardChange = (e) => {
    setForm({ ...form, wardName: e.target.value, beds: [] });
  };

  const handleBedToggle = (bedId) => {
    const newBeds = form.beds.includes(bedId)
      ? form.beds.filter((id) => id !== bedId)
      : [...form.beds, bedId];
    setForm({ ...form, beds: newBeds });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (updateAssign) {
        if (!userAssign || !userAssign._id) {
          throw new Error("Assignment ID not found for update.");
        }
        await updateAssignment(userAssign._id, form); 
        toast.success("Clinical assignment updated.");
        window.location.reload();
      } else {
        await createAssignment(form);
        toast.success("Clinical assignment synchronized.");
        if (typeof onFirstAssignmentComplete === "function") {
          onFirstAssignmentComplete();
        } else {
          window.location.reload();
        }         
      }
      loadDepartments();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(`Sync error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);

  const bedsToDisplay = selectedWard
    ? updateAssign ? selectedWard?.beds
      : selectedWard.beds.filter(bed => !bed.assignedUser || form.beds.includes(bed.id))
    : [];

  const isFormValid = form.deptId && form.deptExpiry && form.wardName && form.wardExpiry && form.beds.length > 0;

  return (
    <div className="max-h-140 overflow-y-auto px-1">
      <form onSubmit={handleSubmit} className="space-y-8 p-1">
        
        {/* Header Section */}
        <div className="border-b border-slate-100 pb-6">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">
            {updateAssign ? "Clinical Update" : "Duty Entry"}
          </h2>
          {msg && (
            <div className="mt-4 flex items-start gap-3 bg-amber-50 border border-amber-100 p-4 rounded-xl text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs font-bold leading-relaxed uppercase tracking-tight">{msg}</p>
            </div>
          )}
        </div>

        {/* Step 1: Department */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Stethoscope size={14} /> 01. Select Department
          </label>
          {!departments.length ? (
            <div className="animate-pulse flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 italic text-sm">
              <Activity size={16} className="animate-pulse text-indigo-400" />
              Fetching department directory...
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              {departments.map((dept) => (
                <label 
                  key={dept._id} 
                  className={`cp flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    form.deptId === dept._id 
                    ? "border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm" 
                    : "border-slate-100 bg-white hover:border-slate-300 text-slate-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="department"
                      value={dept._id}
                      checked={form.deptId === dept._id}
                      onChange={handleDeptChange}
                      required
                      className="accent-indigo-600 h-4 w-4"
                    />
                    <span className="font-bold text-sm tracking-tight uppercase">{dept.name}</span>
                  </div>
                  {form.deptId === dept._id && <ChevronRight size={16} />}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Department Expiry */}
        {form.deptId && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <Calendar size={14} /> 02. Rotation Expiry (Dept)
            </label>
            <input
              type="date"
              className="cp w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-colors"
              value={form.deptExpiry}
              onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
              required
              min={minDate}
            />
          </div>
        )}

        {/* Step 3: Ward Selection */}
        {selectedDept && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <Activity size={14} /> 03. Target Ward
            </label>
            <select
              className="cp w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-colors appearance-none"
              value={form.wardName}
              onChange={handleWardChange}
              required
            >
              <option value="">-- Select Clinical Ward --</option>
              {selectedDept.wards.map((w, idx) => (
                <option key={idx} value={w.name}>{w.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Step 4: Ward Expiry */}
        {form.wardName && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <Calendar size={14} /> 04. Duty Expiry (Ward)
            </label>
            <input
              type="date"
              className="cp w-full p-4 bg-white border-2 border-slate-100 rounded-xl font-bold text-slate-900 focus:border-indigo-600 outline-none transition-colors"
              value={form.wardExpiry}
              onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
              required
              min={minDate}
            />
          </div>
        )}

        {/* Step 5: Bed Selection */}
        {selectedWard && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
              <BedDouble size={14} /> 05. Assigned Units (Beds)
            </label>
            {bedsToDisplay.length === 0 && !updateAssign && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-xs font-bold uppercase italic">
                <AlertCircle size={14} /> Critical: No available units in this ward.
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {bedsToDisplay.map((bed) => (
                <label 
                  key={bed.id} 
                  className={`cp flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    form.beds.includes(bed.id)
                    ? "border-indigo-600 bg-indigo-50"
                    : "border-slate-50 bg-slate-50/50 opacity-80"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={bed.id}
                    checked={form.beds.includes(bed.id)}
                    onChange={() => handleBedToggle(bed.id)}
                    className="accent-indigo-600 h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="font-black text-xs text-slate-900 uppercase">Bed {bed.id}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{bed.status}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Section */}
        <div className="pt-8 border-t border-slate-100 sticky bottom-0 bg-white pb-4">
          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`cp w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-lg text-xs ${
              isFormValid && !loading
                ? "bg-indigo-600 text-white hover:bg-indigo-800 hover:-translate-y-0.5"
                : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            {loading ? "Synchronizing Data..." : updateAssign ? "Update Clinical Station" : "Initialize Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Assignments;