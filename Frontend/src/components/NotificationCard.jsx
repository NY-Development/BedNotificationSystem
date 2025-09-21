import React, { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle } from "lucide-react";
import { markNotificationAsRead } from "../services/notification";

const NotificationCard = ({ notification, onMarkAsRead }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { _id, message, type, bedId, wardName, departmentName, createdAt, from } = notification;

  const handleMarkAsReadClick = async () => {
    try {
      await markNotificationAsRead(_id);
      onMarkAsRead(_id); // Call the parent handler to remove the card from the list
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 relative">
      <div className="flex items-center justify-between mb-2">
        {/* Message */}
        <p className="text-gray-800 font-semibold">{message}</p>
        
        {/* Mark as Read button */}
        <button
          onClick={handleMarkAsReadClick}
          className="cp text-xs text-green-600 font-medium flex items-center p-1 rounded-full transition-colors hover:bg-green-100"
          aria-label="Mark as read"
        >
          <CheckCircle size={16} className="mr-1" />
          Read
        </button>
      </div>

      {/* From */}
      <p className="text-sm text-gray-600 mt-1">
        From:{" "}
        <span className="font-medium text-indigo-600">{from?.name || "Unknown"}</span>
      </p>

      {/* Timestamp */}
      <p className="text-xs text-gray-400 mt-1">
        {new Date(createdAt).toLocaleString()}
      </p>

      {/* Toggle button */}
      <button
        onClick={() => setShowDetails((prev) => !prev)}
        className="absolute bottom-2 right-3 text-xs text-indigo-600 font-medium flex items-center cursor-pointer hover:underline"
      >
        {showDetails ? (
          <>
            Hide <ChevronUp size={14} className="ml-1" />
          </>
        ) : (
          <>
            More <ChevronDown size={14} className="ml-1" />
          </>
        )}
      </button>

      {/* Details */}
      {showDetails && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm border border-gray-100">
          <p>
            <span className="font-semibold">Type:</span>{" "}
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                type === "admit"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {type}
            </span>
          </p>
          <p>
            <span className="font-semibold">Bed:</span> {bedId}
          </p>
          <p>
            <span className="font-semibold">Ward:</span> {wardName}
          </p>
          <p>
            <span className="font-semibold">Department:</span> {departmentName}
          </p>
        </div>
      )}
    </div>
  );
};

export default NotificationCard;