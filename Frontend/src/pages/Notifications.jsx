import React, { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import GoBack from "../components/GoBack";
import { Bell } from "lucide-react";
import { getNotifications } from "../services/notification";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const {user} = useAuth();

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = () => {
    // Re-fetch the notifications to get the updated list from the backend
    fetchNotifications();
  };

  if (!user) {
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
  }

  return (
    <div className="p-8 max-w-4xl mx-auto min-h-screen bg-gray-50">
      <GoBack />
      <div className="flex items-center space-x-4 mb-8">
        <Bell size={40} className="text-yellow-500" />
        <h1 className="text-4xl font-extrabold text-gray-900">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white shadow-xl rounded-xl p-10 text-center flex flex-col items-center">
          <Bell size={64} className="text-gray-300 mb-4" />
          <p className="text-xl text-gray-600 font-semibold">
            No new notifications at this time.
          </p>
          <p className="text-sm text-gray-400 mt-2">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {notifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              onMarkAsRead={handleMarkAsRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;