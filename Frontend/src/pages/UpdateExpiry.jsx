import React, { useState, useEffect } from "react";
import { useAssignment } from "../context/AssignmentContext";
import { updateExpiryDates } from "../services/assignment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  FaExclamationTriangle,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
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
      <div className="p-8 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-8">
        <GoBack />
        <h2 className="text-xl font-bold mb-4">No Update Required</h2>
        <p className="text-gray-600 mb-4">Your expiry dates are still valid.</p>
        <p>
          <strong>Department:</strong> {assignment?.department || "N/A"}
        </p>
        <p>
          <strong>Ward:</strong> {assignment?.ward || "N/A"}
        </p>
        <p>
          <strong>Department Expiry:</strong>{" "}
          {expiry?.deptExpiry
            ? new Date(expiry.deptExpiry).toLocaleDateString()
            : "N/A"}
        </p>
        <p>
          <strong>Ward Expiry:</strong>{" "}
          {expiry?.wardExpiry
            ? new Date(expiry.wardExpiry).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    );
  }

  // --- Handlers ---
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
    <div className="mt-6 max-w-lg mx-auto bg-white border border-red-300 shadow-2xl rounded-xl p-8">
      <div className="flex items-center space-x-3 mb-4 border-b pb-3">
        <FaExclamationTriangle className="text-3xl text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">
          Mandatory Update Required
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Department expired → show dept + ward + both expiries */}
        {isDeptExpired && (
          <>
            <div>
              <label className="block font-semibold">Select Department:</label>
              <select
                className="border p-2 w-full rounded-md"
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

            {selectedDept && (
              <div>
                <label className="block font-semibold">Select Ward:</label>
                <select
                  className="border p-2 w-full rounded-md"
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

            <div>
              <label className="block font-semibold">New Department Expiry:</label>
              <input
                type="date"
                className="border p-2 w-full rounded-md"
                value={form.deptExpiry}
                min={minDate}
                onChange={(e) =>
                  setForm({ ...form, deptExpiry: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block font-semibold">New Ward Expiry:</label>
              <input
                type="date"
                className="border p-2 w-full rounded-md"
                value={form.wardExpiry}
                min={minDate}
                onChange={(e) =>
                  setForm({ ...form, wardExpiry: e.target.value })
                }
                required
              />
            </div>

            {/* Beds checkboxes */}
            {selectedWard && (
              <div>
                <label className="block font-semibold">Select Beds:</label>
                {bedsToDisplay.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">No free beds available in this ward.</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {bedsToDisplay.map((bed) => (
                    <label key={bed.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={bed.id}
                        checked={form.beds.includes(bed.id)}
                        onChange={() => handleBedToggle(bed.id)}
                      />
                      <span>
                        Bed {bed.id} ({bed.status})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Ward expired only → show ward + ward expiry (department fixed to current) */}
        {isWardExpired && !isDeptExpired && (
          <>
            <div>
              <label className="block font-semibold">Current Department:</label>
              <input
                type="text"
                value={assignment?.department || "N/A"}
                disabled
                className="border p-2 w-full rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {departments
              .find((d) => d.name === assignment?.department)
              ?.wards && (
                <div>
                  <label className="block font-semibold">Select Ward:</label>
                  <select
                    className="border p-2 w-full rounded-md"
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
              <label className="block font-semibold">New Ward Expiry:</label>
              <input
                type="date"
                className="border p-2 w-full rounded-md"
                value={form.wardExpiry}
                min={minDate}
                onChange={(e) =>
                  setForm({ ...form, wardExpiry: e.target.value })
                }
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>Confirm & Update</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateExpiry;