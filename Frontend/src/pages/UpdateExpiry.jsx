import React, { useState, useEffect } from "react";
import { useAssignment } from "../context/AssignmentContext";
import { updateExpiryDates } from "../services/assignment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
// Replaced react-icons/fa with standard Lucide icons for stability
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"; 
import GoBack from "../components/GoBack";
import { useBed } from "../context/BedContext";
import { getDepartments } from "../services/department";

const UpdateExpiry = () => {
  const { user } = useAuth();
  const { userAssign, fetchExpiry, getUserAssignment } = useAssignment();
  const [form, setForm] = useState({
    deptId: "",
    wardName: "",
    deptExpiry: "",
    wardExpiry: "",
    beds: [], // Added to manage selected beds
  });
  const [loading, setLoading] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [departments, setDepartments] = useState([]);

  // Load all departments for dropdown
  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error);
  }, [user]);

  // Load current assignment + expiry
  useEffect(() => {
    const loadData = async () => {
      const expiryData = await fetchExpiry();
      setExpiry(expiryData);

      const assignData = await getUserAssignment();
      setAssignment(assignData);

      setForm((prev) => ({
        ...prev,
        deptId: departments.find((d) => d.name === assignData?.department)?._id || "",
        wardName: assignData?.ward || "",
      }));
    };
    loadData();
  }, [user, departments]);

  // Beds filtering logic
  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);
  const bedsToDisplay = selectedWard ? selectedWard.beds.filter(bed => !bed.assignedUser) : [];

  // Dates for validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  // Helpers for expiry status
  const getStatus = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    d.setHours(0, 0, 0, 0);
    if (d <= today) return "Expired";
    const days = Math.ceil((d - today) / (1000 * 60 * 60 * 24));
    return days <= 3 ? "ExpiringSoon" : "Valid";
  };

  const deptStatus = getStatus(expiry?.deptExpiry);
  const wardStatus = getStatus(expiry?.wardExpiry);

  const isDeptExpired = deptStatus === "Expired";
  const isWardExpired = wardStatus === "Expired";

  // If nothing expired or intern → show info only
  if ((!isDeptExpired && !isWardExpired) || user?.role === "intern") {
    return (
      <div className="p-6 sm:p-8 bg-white rounded-2xl shadow-2xl max-w-xl mx-auto mt-8 border-t-4 border-emerald-500">
        <GoBack />
        <div className="flex items-center space-x-3 mb-6 border-b pb-4">
          <CheckCircle className="w-7 h-7 text-emerald-600" />
          <h2 className="text-2xl font-bold text-gray-800">No Update Required</h2>
        </div>
        <p className="text-gray-600 mb-6 border-b pb-4">
          Your current assignment and expiry dates are valid.
        </p>

        <div className="space-y-4">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="text-gray-800">
              <strong className="font-semibold text-indigo-700">Department:</strong> {assignment?.department || "N/A"}
            </p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-lg">
            <p className="text-gray-800">
              <strong className="font-semibold text-indigo-700">Ward:</strong> {assignment?.ward || "N/A"}
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
            <p className="text-gray-700">
              <strong className="font-medium">Department Expiry:</strong>
            </p>
            <span className="font-mono text-sm text-gray-900">
              {expiry?.deptExpiry
                ? new Date(expiry.deptExpiry).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg flex justify-between">
            <p className="text-gray-700">
              <strong className="font-medium">Ward Expiry:</strong>
            </p>
            <span className="font-mono text-sm text-gray-900">
              {expiry?.wardExpiry
                ? new Date(expiry.wardExpiry).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --- Handlers (Logic untouched) ---
  const handleDeptChange = (e) => {
    setForm({ ...form, deptId: e.target.value, wardName: "", beds: [] });
  };

  const handleWardChange = (e) => {
    setForm({ ...form, wardName: e.target.value, beds: [] });
  };

  const handleBedToggle = (bedId) => {
    const newBeds = form.beds.includes(bedId)
      ? form.beds.filter(id => id !== bedId)
      : [...form.beds, bedId];
    setForm({ ...form, beds: newBeds });
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
        department: isDeptExpired ? selectedDept?.name : assignment?.department,
        ward: isDeptExpired ? form.wardName : isWardExpired ? form.wardName : assignment?.ward,
        beds: form.beds, // Send the selected beds
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

  // --- Form UI ---
  return (
    <div className="mt-8 max-w-xl mx-auto bg-white border-4 border-red-500 shadow-2xl rounded-2xl p-6 sm:p-8 transform transition-all duration-300">
      <div className="flex items-center space-x-4 mb-6 border-b pb-4">
        <AlertTriangle className="w-8 h-8 text-red-600" />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Mandatory Update Required
        </h2>
      </div>

      {/* Warning Alert */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-200 mb-6">
          <p className="text-sm text-red-800">
              <span className="font-bold">Urgent:</span> Your assignment details are expired. Please fill out the form below to update your rotation and continue using the system.
          </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department expired → show dept + ward + both expiries */}
        {isDeptExpired && (
          <div className="space-y-5">
            {/* Department Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Select Department:</label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white appearance-none"
                value={form.deptId}
                onChange={handleDeptChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward Select (conditional) */}
            {selectedDept && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Select Ward:</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white appearance-none"
                  value={form.wardName}
                  onChange={handleWardChange}
                  required
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Department Expiry:</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={form.deptExpiry}
                  min={minDate}
                  onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">New Ward Expiry:</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={form.wardExpiry}
                  min={minDate}
                  onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Beds checkboxes - Styled Container */}
            {selectedWard && (
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <label className="block font-semibold text-blue-800 mb-3">Select Beds to Cover:</label>
                {bedsToDisplay.length === 0 && (
                  <p className="text-sm text-red-600 mt-1 p-2 bg-white rounded-lg">
                    No free beds available in this ward currently.
                  </p>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {bedsToDisplay.map((bed) => (
                    <label key={bed.id} className={`flex items-center space-x-2 p-3 rounded-lg cursor-pointer transition-colors text-sm ${
                      form.beds.includes(bed.id) ? 'bg-blue-300 text-blue-900 font-semibold shadow-inner' : 'bg-white hover:bg-gray-100 border border-gray-200'
                    }`}>
                      <input
                        type="checkbox"
                        value={bed.id}
                        checked={form.beds.includes(bed.id)}
                        onChange={() => handleBedToggle(bed.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="truncate">
                        Bed {bed.id}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ward expired only → show ward + ward expiry (department fixed to current) */}
        {isWardExpired && !isDeptExpired && (
          <div className="space-y-5">
            {/* Current Department (Disabled) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Current Department (Valid):</label>
              <input
                type="text"
                value={assignment?.department || "N/A"}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-inner bg-gray-100 text-gray-700 cursor-not-allowed"
              />
            </div>

            {departments
              .find((d) => d.name === assignment?.department)
              ?.wards && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Select New Ward:</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white appearance-none"
                    value={form.wardName}
                    onChange={handleWardChange}
                    required
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Ward Expiry:</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={form.wardExpiry}
                min={minDate}
                onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
                required
              />
            </div>
            {/* Note: Bed selection logic would naturally be required here as well, 
            but keeping the original logic flow of only showing it when isDeptExpired is true, 
            unless the original bedsToDisplay logic is used to conditionally show it here too. */}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="cp w-full flex items-center justify-center space-x-3 px-6 py-3 mt-6 bg-red-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-red-500/50 hover:bg-red-700 disabled:bg-gray-400 disabled:shadow-none transition-all duration-300 uppercase tracking-wide transform hover:scale-[1.01]"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              <span>Submitting Update...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Confirm & Update</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateExpiry;