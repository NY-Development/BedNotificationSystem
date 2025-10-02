import React, { useState, useEffect } from "react";
import { useAssignment } from "../context/AssignmentContext";
import { updateExpiryDates } from "../services/assignment";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import { FaCalendarAlt, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaClock } from 'react-icons/fa';

const UpdateExpiry = () => {
  const { user } = useAuth();
  const { userAssign, fetchExpiry, getUserAssignment } = useAssignment();
  const [form, setForm] = useState({ deptExpiry: "", wardExpiry: "" });
  const [loading, setLoading] = useState(false);
  const [expiry, setExpiry] = useState(null);
  const [assignment, setAssignment] = useState(null);

  // Normalize today's date to ISO string for date input min attribute
  const todayISO = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const loadData = async () => {
      // Fetch data and initialize state
      const expiryData = await fetchExpiry();
      setExpiry(expiryData);

      const assignData = await getUserAssignment();
      setAssignment(assignData);
    };
    loadData();
  }, [user]);

  // --- EXPIRY LOGIC & HELPERS ---

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const getStatusAndDays = (dateString) => {
    if (!dateString) return { status: 'N/A', days: null };
    const expirationDate = new Date(dateString);
    expirationDate.setHours(0, 0, 0, 0);

    const timeDifference = expirationDate.getTime() - currentDate.getTime();
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    if (daysDifference < 0) return { status: 'Expired', days: daysDifference };
    if (daysDifference <= 3) return { status: 'ExpiringSoon', days: daysDifference };
    return { status: 'Valid', days: daysDifference };
  };

  const deptStatusData = getStatusAndDays(expiry?.deptExpiry);
  const wardStatusData = getStatusAndDays(expiry?.wardExpiry);

  const isDeptExpired = deptStatusData.status === 'Expired';
  const isWardExpired = wardStatusData.status === 'Expired';

  const isDeptExpiringSoon = deptStatusData.status === 'ExpiringSoon';
  const isWardExpiringSoon = wardStatusData.status === 'ExpiringSoon';

  const isAnyExpired = isDeptExpired || isWardExpired;
  const isAnyExpiringSoon = isDeptExpiringSoon || isWardExpiringSoon;

  // Interns or if nothing is expired, show the info view
  if (user?.role === "intern" || !isAnyExpired) {
    // --- VALID VIEW WITH OPTIONAL WARNING ---
    
    // Dynamic classes based on warning status
    const isWarning = isAnyExpiringSoon && !isAnyExpired;
    
    const mainBgClass = isWarning
      ? "bg-gradient-to-br from-yellow-50 to-orange-100 border border-orange-300"
      : "bg-gradient-to-br from-white to-gray-50 border border-green-200";

    const mainTitleColor = isWarning ? "text-orange-700" : "text-green-600";
    const mainEmoji = isWarning ? "💡" : "✨";
    const mainTitle = isWarning ? "Heads Up: Dates Approaching!" : "Status: Everything is Valid!";

    const expiryCardClasses = (isSoon) => isSoon 
      ? "p-3 bg-orange-100 rounded-lg ring-2 ring-orange-400" 
      : "p-3 bg-gray-100 rounded-lg";
    const expiryIcon = (isSoon) => isSoon 
      ? <FaExclamationTriangle className="text-orange-500" /> 
      : <FaCalendarAlt className="text-gray-500" />;

    const renderExpiryInfo = (statusData, expiryDate) => {
      const { status, days } = statusData;
      
      if (status === 'Expired') {
          return <span className="text-red-600 font-bold text-lg">EXPIRED! ({new Date(expiryDate).toLocaleDateString()})</span>;
      }
      if (status === 'ExpiringSoon') {
        return (
          <span className="text-orange-700 font-bold text-lg">
            {new Date(expiryDate).toLocaleDateString()}
            <span className="ml-2 text-sm text-red-600 font-semibold flex items-center">
              <FaClock className="mr-1" />
              {days} day{days !== 1 ? 's' : ''} left!
            </span>
          </span>
        );
      }
      return <span className="text-gray-900 font-medium">{expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}</span>;
    };


    return (
      <div className={`p-8 rounded-2xl shadow-2xl min-h-screen ${mainBgClass}`}>
        
        <div className="flex items-center space-x-3 mb-4">
          <span className="text-3xl">{mainEmoji}</span>
          <h2 className={`text-3xl font-bold ${mainTitleColor}`}>
            {mainTitle}
          </h2>
        </div>

        <p className="text-xl text-gray-700">
          {isWarning && user?.role !== "intern" ? (
            <span className="font-medium text-orange-800">
              Your dates are approaching expiry. Please update them soon  to maintain access.
            </span>
          ) : (
            <span className="font-medium">
              No immediate action required—your current assignment and **expiry dates look great**.
            </span>
          )}
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 text-base">
          
          {/* Department Info */}
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="font-semibold text-gray-500 flex items-center">
              <span className="mr-2">🏢</span>Department
            </p>
            <p className="text-gray-900 font-medium mt-1">
              {assignment?.department || <span className="italic text-gray-400">N/A</span>}
            </p>
          </div>

          {/* Ward Info */}
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="font-semibold text-gray-500 flex items-center">
              <span className="mr-2">🏥</span>Ward/Unit
            </p>
            <p className="text-gray-900 font-medium mt-1">
              {assignment?.ward || <span className="italic text-gray-400">N/A</span>}
            </p>
          </div>

          {/* Department Expiry Info */}
          <div className={expiryCardClasses(isDeptExpiringSoon || isDeptExpired)}>
            <p className="font-semibold text-gray-700 flex items-center">
              <span className="mr-2">{expiryIcon(isDeptExpiringSoon || isDeptExpired)}</span>Department Expiry
            </p>
            <p className="mt-1">
              {renderExpiryInfo(deptStatusData, expiry?.deptExpiry)}
            </p>
          </div>

          {/* Ward Expiry Info */}
          <div className={expiryCardClasses(isWardExpiringSoon || isWardExpired)}>
            <p className="font-semibold text-gray-700 flex items-center">
              <span className="mr-2">{expiryIcon(isWardExpiringSoon || isWardExpired)}</span>Ward Expiry
            </p>
            <p className="mt-1">
              {renderExpiryInfo(wardStatusData, expiry?.wardExpiry)}
            </p>
          </div>

        </div>
      </div>
    );
  }

  // --- FORM SUBMISSION HANDLER ---

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if new dates are actually greater than the expired ones
    const deptUpdateNeeded = isDeptExpired && (!form.deptExpiry || new Date(form.deptExpiry) <= new Date(expiry.deptExpiry));
    const wardUpdateNeeded = isWardExpired && (!form.wardExpiry || new Date(form.wardExpiry) <= new Date(expiry.wardExpiry));

    if (deptUpdateNeeded || wardUpdateNeeded) {
        toast.error("Please enter a new date greater than the currently expired date.");
        return;
    }

    if (!userAssign?._id) {
      toast.error("No assignment found to update.");
      return;
    }

    try {
      setLoading(true);
      await updateExpiryDates(userAssign._id, {
        // Only send the form value if the field was expired, otherwise use the existing data
        deptExpiry: isDeptExpired ? form.deptExpiry : expiry.deptExpiry,
        wardExpiry: isWardExpired ? form.wardExpiry : expiry.wardExpiry,
      });
      toast.success("Expiry updated successfully! 🎉");
      
      // Re-fetch and update local state to trigger a re-render
      const newExpiry = await fetchExpiry();
      setExpiry(newExpiry);
      setForm({ deptExpiry: "", wardExpiry: "" }); // Clear form to re-enable required status check

    } catch (err) {
      console.error(err);
      toast.error("Failed to update expiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- EXPIRY UPDATE FORM VIEW (ONLY when isAnyExpired is true) ---

  return (
    <div className="mt-6 max-w-lg mx-auto bg-white border border-red-300 shadow-2xl rounded-xl p-8">
      
      <div className="flex items-center space-x-3 mb-4 border-b pb-3">
        <FaExclamationTriangle className="text-3xl text-red-500" />
        <h2 className="text-2xl font-bold text-gray-800">
            Mandatory Update Required
        </h2>
      </div>

      <p className="text-red-700 mb-6 bg-red-50 p-3 rounded-md text-sm font-medium">
        **ACCESS REVOKED:** One or more of your assignment expiry dates has passed. You must update the required date(s) below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Department Expiry Input */}
        {isDeptExpired && (
          <div className="relative border-l-4 border-red-500 pl-3 py-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Department Expiry Date:
              <span className="ml-2 text-xs font-normal text-red-500">
                (CURRENTLY EXPIRED: {expiry?.deptExpiry ? new Date(expiry.deptExpiry).toLocaleDateString() : 'N/A'})
              </span>
            </label>
            <div className="relative">
                <input
                    type="date"
                    className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                    value={form.deptExpiry}
                    min={todayISO} // Use today's ISO date string
                    onChange={(e) => setForm({ ...form, deptExpiry: e.target.value })}
                    required
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
            </div>
          </div>
        )}

        {/* Ward Expiry Input */}
        {isWardExpired && (
          <div className="relative border-l-4 border-red-500 pl-3 py-1">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              New Ward Expiry Date:
              <span className="ml-2 text-xs font-normal text-red-500">
                (CURRENTLY EXPIRED: {expiry?.wardExpiry ? new Date(expiry.wardExpiry).toLocaleDateString() : 'N/A'})
              </span>
            </label>
            <div className="relative">
                <input
                    type="date"
                    className="pl-10 pr-4 py-2 w-full border border-red-300 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150"
                    value={form.wardExpiry}
                    min={todayISO} // Use today's ISO date string
                    onChange={(e) => setForm({ ...form, wardExpiry: e.target.value })}
                    required
                />
                <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400" />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!isDeptExpired && !isWardExpired)} // Disable if no fields are active
          className="cp w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition duration-150 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <FaSpinner className="animate-spin" />
              <span>Submitting Update...</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>Confirm & Update Expired Dates</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateExpiry;