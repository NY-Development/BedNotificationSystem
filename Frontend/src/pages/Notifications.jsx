import React, { useEffect, useState } from "react";
import NotificationCard from "../components/NotificationCard";
import GoBack from "../components/GoBack";
import { Bell } from "lucide-react";
import { getNotifications } from "../services/notification";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

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

  const handleMarkAsRead = (id) => {
    // Filter out the notification that was just marked as read
    setNotifications((prevNotifications) =>
      prevNotifications.filter((n) => n._id !== id)
    );
  };

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
              onMarkAsRead={() => handleMarkAsRead(n._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;