import React, { useState, useEffect } from "react";
import { useAssignment } from "../context/AssignmentContext";
import { updateAssignment } from "../services/assignment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

const UpdateExpiry = () => {
  const { user } = useAuth();
  const { expiry, userAssign, fetchExpiry, getUserAssignment } = useAssignment();
  const [form, setForm] = useState({ deptExpiry: "", wardExpiry: "" });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchExpiry();
    getUserAssignment();
  }, []);

  // Check expiry conditions
  const isDeptExpired = expiry?.deptExpiry && new Date(expiry.deptExpiry) <= new Date();
  const isWardExpired = expiry?.wardExpiry && new Date(expiry.wardExpiry) <= new Date();

  // Hide form if nothing expired OR user is intern
  if ((!isDeptExpired && !isWardExpired) || user?.role === "intern") {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold">No update required</h2>
        <p className="text-gray-600">Your expiry dates are still valid.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userAssign?._id) {
      toast.error("No assignment found to update.");
      return;
    }

    try {
      setLoading(true);
      await updateAssignment(userAssign._id, {
        deptExpiry: form.deptExpiry || expiry.deptExpiry,
        wardExpiry: form.wardExpiry || expiry.wardExpiry,
      });
      toast.success("Expiry updated successfully!");
      await fetchExpiry();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update expiry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h2 className="text-xl font-bold mb-4">Update Expiry Dates</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isDeptExpired && (
          <div>
            <label className="block font-semibold">New Department Expiry:</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={form.deptExpiry}
              min={today}
              onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
              required
            />
          </div>
        )}
        {isWardExpired && (
          <div>
            <label className="block font-semibold">New Ward Expiry:</label>
            <input
              type="date"
              className="border p-2 w-full rounded"
              value={form.wardExpiry}
              min={today}
              onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
              required
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Expiry"}
        </button>
      </form>
    </div>
  );
};

export default UpdateExpiry;
