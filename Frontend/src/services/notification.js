import API from "./axios";

export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

export const getUnreadNotificationsCount = async () => {
  const res = await API.get("/notifications/unread/count");
  return res.data;
};