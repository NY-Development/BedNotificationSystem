import React, { useState, useEffect } from "react";
import { useAssignment } from "../context/AssignmentContext";
import { updateExpiryDates } from "../services/assignment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { AlertTriangle, CheckCircle, Loader2, BedSingle, CalendarDays, Zap } from "lucide-react";
import GoBack from "../components/GoBack";
import { getDepartments } from "../services/department";
import { Link } from "react-router-dom";

const UpdateExpiry = () => {
  const { user } = useAuth();
  // Using destructuring as provided by the user's latest code structure
  const { userAssign, fetchExpiry, getUserAssignment } = useAssignment();

  const [form, setForm] = useState({
    deptId: "",
    wardName: "",
    deptExpiry: "",
    wardExpiry: "",
    beds: [],
  });

  const [loading, setLoading] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [initLoading, setInitLoading] = useState(true);

  // --- Load all data once (Logic preserved as requested) ---
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setInitLoading(true);
        // Note: The original code uses fetchExpiry/getUserAssignment (from context), 
        // which might trigger concurrent calls depending on the context implementation. 
        // Logic preserved as per user request.
        const [expiryData, assignData, deptData] = await Promise.all([
          fetchExpiry(),
          getUserAssignment(),
          getDepartments(),
        ]);

        setExpiry(expiryData);
        setAssignment(assignData);
        setDepartments(deptData);

        // Default form setup based on current assignment
        const currentDept = deptData.find((d) => d.name === assignData?.department);
        setForm((prev) => ({
          ...prev,
          deptId: currentDept?._id || "",
          wardName: assignData?.ward || "",
        }));
      } catch (err) {
        console.error("Error loading data:", err);
        toast.error("Failed to load expiry data.");
      } finally {
        setInitLoading(false);
      }
    };

    loadAllData();
  }, [user]);

  // --- Handle Loading UI - Enhanced Styling ---
  if (initLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
        <Loader2 className="animate-spin w-10 h-10 mb-4 text-indigo-600" />
        <p className="text-xl font-semibold text-gray-800">Loading your assignment details...</p>
        <p className="text-sm text-gray-500 mt-1">Please wait a moment while we retrieve your current rotation data.</p>
      </div>
    );
  }

    if (!user?.subscription?.isActive) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce">❌</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-lg text-gray-600 mb-6">Please log in to view this page.</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300 rounded-full shadow-lg transform hover:scale-105"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  };
  // --- Data References ---
  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);
  const bedsToDisplay = selectedWard
    ? selectedWard.beds.filter((bed) => !bed.assignedUser)
    : [];

  // --- Dates ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // --- Expiry Checkers (Logic preserved) ---
  const getStatus = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    if (d <= today) return "Expired";
    const days = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return days <= 3 ? "ExpiringSoon" : "Valid";
  };

  const deptStatus = getStatus(expiry?.deptExpiry);
  const wardStatus = getStatus(expiry?.wardExpiry);
  const isDeptExpired = deptStatus === "Expired";
  const isWardExpired = wardStatus === "Expired";

  // --- Handlers (Logic preserved) ---
  const handleDeptChange = (e) => {
    setForm({ ...form, deptId: e.target.value, wardName: "", beds: [] });
  };

  const handleWardChange = (e) => {
    setForm({ ...form, wardName: e.target.value, beds: [] });
  };

  const handleBedToggle = (bedId) => {
    setForm((prev) => ({
      ...prev,
      beds: prev.beds.includes(bedId)
        ? prev.beds.filter((id) => id !== bedId)
        : [...prev.beds, bedId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAssign?._id) {
      toast.error("No assignment found to update.");
      return;
    }

    try {
      setLoading(true);
      await updateExpiryDates(userAssign._id, {
        deptExpiry: isDeptExpired ? form.deptExpiry : expiry.deptExpiry,
        wardExpiry: isWardExpired ? form.wardExpiry : expiry.wardExpiry,
        department: isDeptExpired
          ? selectedDept?.name
          : assignment?.department,
        ward:
          isDeptExpired || isWardExpired
            ? form.wardName
            : assignment?.ward,
        beds: form.beds,
      });

      toast.success("Expiry updated successfully! ✅");
      const newExpiry = await fetchExpiry();
      setExpiry(newExpiry);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expiry.");
    } finally {
      setLoading(false);
    }
  };

  // --- No Update Needed UI - Enhanced Styling ---
  if ((!isDeptExpired && !isWardExpired) || user?.role === "intern") {
    return (
      <div className="p-8 bg-white rounded-3xl shadow-2xl max-w-xl mx-auto mt-12 border-t-8 border-green-500 transform transition-all duration-500 hover:shadow-green-300/50">
        <GoBack />
        <div className="flex items-center space-x-3 mb-6 border-b pb-4">
          <CheckCircle className="text-green-600 w-8 h-8" />
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            No Update Required
          </h2>
        </div>
        <p className="text-lg text-gray-700 mb-8">
          Your current assignment and expiry dates are **valid**.
        </p>

        <div className="space-y-4">
          {/* Data Card 1: Department */}
          <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-xl shadow-inner">
            <p className="font-semibold text-gray-700 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-green-600" />
              Department:
            </p>
            <span className="font-bold text-lg text-green-800">
                {assignment?.department || "N/A"}
            </span>
          </div>

          {/* Data Card 2: Ward */}
          <div className="flex justify-between items-center p-4 bg-green-50 border border-green-200 rounded-xl shadow-inner">
            <p className="font-semibold text-gray-700 flex items-center">
                <BedSingle className="w-5 h-5 mr-2 text-green-600" />
                Ward:
            </p>
            <span className="font-bold text-lg text-green-800">
                {assignment?.ward || "N/A"}
            </span>
          </div>

          {/* Data Card 3: Department Expiry */}
          <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-gray-600 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" />
                Dept Expiry Date:
            </p>
            <span className="font-mono text-base text-gray-900">
                {expiry?.deptExpiry ? new Date(expiry.deptExpiry).toLocaleDateString() : "N/A"}
            </span>
          </div>
          
          {/* Data Card 4: Ward Expiry */}
          <div className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-gray-600 flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" />
                Ward Expiry Date:
            </p>
            <span className="font-mono text-base text-gray-900">
                {expiry?.wardExpiry ? new Date(expiry.wardExpiry).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- Expired UI - Enhanced Form Styling ---
  return (
    <div className="mt-12 mb-12 max-w-xl mx-auto bg-white border-4 border-red-600 shadow-2xl shadow-red-300/60 rounded-3xl p-6 sm:p-8 transform transition-all duration-500">
      <div className="flex items-center space-x-4 mb-6 border-b pb-4">
        <AlertTriangle className="text-red-600 w-9 h-9" />
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Mandatory Update
        </h2>
      </div>
      
      {/* Urgent Message Alert */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-300 mb-8">
        <p className="text-base text-red-800 font-medium flex items-start">
            <span className="text-red-600 mr-2 text-xl">⚠️</span>
            Your assignment has **expired**. Please complete the rotation and bed selection below to regain system access.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* --- DEPARTMENT EXPIRED BLOCK --- */}
        {isDeptExpired && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-red-700 border-b pb-2">Full Rotation Change</h3>
            
            {/* Department Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Select New Department:
              </label>
              <select
                value={form.deptId}
                onChange={handleDeptChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 bg-white text-gray-800 appearance-none"
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward Select */}
            {selectedDept && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select Ward:
                </label>
                <select
                  value={form.wardName}
                  onChange={handleWardChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-150 bg-white text-gray-800 appearance-none"
                >
                  <option value="">-- Select Ward --</option>
                  {selectedDept.wards.map((w, idx) => (
                    <option key={idx} value={w.name}>
                      {w.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Expiry Dates - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Department Expiry:
                </label>
                <input
                  type="date"
                  value={form.deptExpiry}
                  min={minDate}
                  onChange={(e) =>
                    setForm({ ...form, deptExpiry: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  New Ward Expiry:
                </label>
                <input
                  type="date"
                  value={form.wardExpiry}
                  min={minDate}
                  onChange={(e) =>
                    setForm({ ...form, wardExpiry: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-800"
                />
              </div>
            </div>
          </div>
        )}

        {/* --- WARD EXPIRED ONLY BLOCK --- */}
        {isWardExpired && !isDeptExpired && (
          <div className="space-y-6">
             <h3 className="text-xl font-bold text-red-700 border-b pb-2">Ward Rotation Change Only</h3>

            {/* Current Department (Disabled) */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Current Department (Valid)
              </label>
              <input
                type="text"
                value={assignment?.department || "N/A"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {/* Ward Select */}
            {departments.find((d) => d.name === assignment?.department)
              ?.wards && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Select New Ward:
                </label>
                <select
                  value={form.wardName}
                  onChange={handleWardChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-800 appearance-none"
                >
                  <option value="">-- Select Ward --</option>
                  {departments
                    .find((d) => d.name === assignment?.department)
                    .wards.map((w, idx) => (
                      <option key={idx} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Ward Expiry */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                New Ward Expiry Date:
              </label>
              <input
                type="date"
                value={form.wardExpiry}
                min={minDate}
                onChange={(e) =>
                  setForm({ ...form, wardExpiry: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-gray-800"
              />
            </div>
          </div>
        )}

        {/* Bed Selection - Enhanced Styling */}
        {selectedWard && (
          <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-300 shadow-md mt-6">
            <label className="flex items-center font-extrabold text-blue-800 mb-4 text-lg">
              <BedSingle className="w-6 h-6 mr-3 text-blue-600" />
              Select Beds to Cover:
            </label>
            {bedsToDisplay.length === 0 && (
              <p className="text-sm text-red-600 bg-white p-3 rounded-lg border border-red-200 shadow-inner">
                No free beds available in this ward currently. Please contact an admin.
              </p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {bedsToDisplay.map((bed) => (
                <label
                  key={bed.id}
                  className={`flex items-center space-x-2 p-3 rounded-xl text-base font-medium cursor-pointer transition-all duration-200 border-2 ${
                    form.beds.includes(bed.id)
                      ? "bg-blue-600 text-white border-blue-700 shadow-lg scale-[1.02]"
                      : "bg-white text-gray-800 hover:bg-gray-100 border-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={bed.id}
                    checked={form.beds.includes(bed.id)}
                    onChange={() => handleBedToggle(bed.id)}
                    className="h-5 w-5 text-white border-white rounded focus:ring-blue-300"
                    style={{ backgroundColor: form.beds.includes(bed.id) ? 'white' : 'transparent', borderColor: form.beds.includes(bed.id) ? 'white' : 'gray' }}
                  />
                  <span>Bed {bed.id}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button - Highly Prominent Styling */}
        <button
          type="submit"
          disabled={loading || (isDeptExpired && !form.deptExpiry) || (isWardExpired && !form.wardExpiry) || !form.wardName}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 mt-8 bg-red-600 text-white font-extrabold text-lg rounded-xl shadow-xl shadow-red-500/50 hover:bg-red-700 disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 uppercase tracking-wider transform hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Submitting Update...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirm & Update Rotation</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateExpiry;