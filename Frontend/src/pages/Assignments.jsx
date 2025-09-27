import React, { useEffect, useState } from "react";
import { createAssignment, updateAssignment } from "../services/assignment";
import { getDepartments } from "../services/department";
import { toast } from "react-hot-toast";
import { useBed } from "../context/BedContext";
import { useAuth } from "../context/AuthContext";
// NEW IMPORT: Need useAssignment to get the existing assignment ID for the PUT request
import { useAssignment } from "../context/AssignmentContext"; 

const Assignments = ({ closeModal, updateAssign = false }) => {
  const { loadDepartments } = useBed();
  const { user } = useAuth();
  // NEW: Get userAssign to access the assignment ID
  const { userAssign, getUserAssignment } = useAssignment();
  const [msg, setMsg] = useState('');

  // Effect 1: Fetch user assignments
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
      setMsg('Warning ⚠️: Updating here overrides all previous assignments!');
    } else {
      setMsg('');
    }
  }, [updateAssign]);

  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    deptId: "",
    wardName: "",
    beds: [],
    deptExpiry: "",
    wardExpiry: "",
  });
  const [loading, setLoading] = useState(false);

  // Load departments
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
        // ⭐️ CORRECTION: Use assignment ID (userAssign._id) for the PUT request
        if (!userAssign || !userAssign._id) {
          throw new Error("Assignment ID not found for update.");
        }
        await updateAssignment(userAssign._id, form); 
        toast.success("Assignment updated successfully!");
        window.location.reload();
      } else {
        await createAssignment(form);
        toast.success("Assignment saved!");
        window.location.reload();
      }
      loadDepartments();
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save assignment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedDept = departments.find((d) => d._id === form.deptId);
  const selectedWard = selectedDept?.wards.find((w) => w.name === form.wardName);

  // 🔑 NEW FILTERING LOGIC: Determine which beds to display based on 'updateAssign' prop
const bedsToDisplay = selectedWard
  ? updateAssign
    ? selectedWard.beds.filter(bed => 
        !bed.assignedUser || bed.assignedUser.name === user.name // Filter out assigned beds not belonging to the current user
      )
    : selectedWard.beds.filter(bed => 
        !bed.assignedUser || form.beds.includes(bed.id) // Filter: show UNASSIGNED beds OR beds currently selected in the form
      )
  : [];

  const isFormValid =
    form.deptId &&
    form.deptExpiry &&
    form.wardName &&
    form.wardExpiry &&
    form.beds.length > 0;

  return (
    <div className="max-h-[500px] overflow-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold mb-2">
          <p className={`${msg ? 'text-yellow-600 mb-2' : ''}`}>{msg}</p>
          {updateAssign ? "Update your assignments" : "Insert your assigned beds"}
        </h2>

        {/* Department radio */}
        <div>
          <label className="block font-semibold">Select Department:</label>
          {departments.map((dept) => (
            <label key={dept._id} className="block">
              <input
                type="radio"
                name="department"
                value={dept._id}
                checked={form.deptId === dept._id}
                onChange={handleDeptChange}
                required
                className="border-1 border-indigo-500"
              />{" "}
              {dept.name}
            </label>
          ))}
        </div>

        {/* Dept expiry */}
        <div>
          <label className="block font-semibold">Department Expiry:</label>
          <input
            type="date"
            className="border p-2 w-full rounded-md"
            value={form.deptExpiry}
            onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
            required
          />
        </div>

        {/* Ward select */}
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

        {/* Ward expiry */}
        {form.wardName && (
          <div>
            <label className="block font-semibold">Ward Expiry:</label>
            <input
              type="date"
              className="border p-2 w-full rounded-md"
              value={form.wardExpiry}
              onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
              required
            />
          </div>
        )}

        {/* Beds checkboxes */}
        {selectedWard && (
          <div>
            <label className="block font-semibold">Select Beds:</label>
            {/* Show message if no free beds available during initial create */}
            {bedsToDisplay.length === 0 && !updateAssign && (
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

        {/* Save button */}
        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`px-4 py-2 rounded w-full ${
            isFormValid
              ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Saving..."
            : updateAssign
            ? "Update Assignment"
            : "Save Assignment"}
        </button>
      </form>
    </div>
  );
};

export default Assignments;