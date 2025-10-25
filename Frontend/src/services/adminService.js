import API from "./axios";

// ----- System stats -----
export const getStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

// ----- Users -----
export const getAllUsers = async () => {
  // Use the getAllSubscriptions endpoint to get subscription details
  const res = await API.get("/admin/subscriptions");
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/admin/users/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

// ----- Subscription Management -----
export const activateSubscription = async (userId) => {
    const res = await API.put(`/admin/${userId}/activate`);
    return res.data;
};

export const deactivateSubscription = async (userId) => {
    const res = await API.put(`/admin/${userId}/deactivate`);
    return res.data;
};

export const updateUserData = async (userId, newRole) => {
    const res = await API.put('/admin/data', {
        type: "userRole",
        payload: { userId, newRole }
    });
    return res.data;
};

// ----- Assignments -----
export const getAllAssignments = async () => {
  const res = await API.get("/admin/assignments");
  return res.data;
};

// ----- Notifications -----
export const getAllNotifications = async () => {
  const res = await API.get("/admin/notifications");
  return res.data;
};

// ----- Departments -----
export const getAllDepartments = async () => {
  const res = await API.get("/admin/departments");
  return res.data;
};

export const addDepartment = async (name) => {
  const res = await API.post("/admin/departments", { name });
  return res.data;
};

export const deleteDepartment = async (deptId) => {
  const res = await API.delete(`/admin/departments/${deptId}`);
  return res.data;
};

// ----- Wards -----
export const addWard = async (deptId, name) => {
  const res = await API.post(`/admin/departments/${deptId}/wards`, { name });
  return res.data;
};

export const deleteWard = async (deptId, wardId) => {
  const res = await API.delete(`/admin/departments/${deptId}/wards/${wardId}`);
  return res.data;
};

// ----- Beds -----
export const addBed = async (deptId, wardId, bedData) => {
  const res = await API.post(`/admin/departments/${deptId}/wards/${wardId}/beds`, bedData);
  return res.data;
};

export const deleteBed = async (deptId, wardId, bedId) => {
  const res = await API.delete(`/admin/departments/${deptId}/wards/${wardId}/beds/${bedId}`);
  return res.data;
};

// ----- Refined Messages -----
export const sendRefinedMessage = async ({ recipient, subject, message }) => {
  try {
    const response = await API.post('/support/refined-message', {
      recipient,
      subject,
      message,
    });
    return response.data;
  } catch (error) {
    console.error('Error sending refined message:', error);
    throw error;
  }
};

// -----getMessages-------
export const getMessages = async () => {
  try {
    const response = await API.get('/support/messages');
    return response.data;
  } catch (error) {
    console.error('Error retrieving messages:', error);
    throw error;
  }
};

export const updateMessageReadStatus = async (msgId) => {
  try {
    const response = await API.patch(`/support/messages/${msgId}/read`, { read: true });
    return response.data;
  } catch (error) {
    console.error('Error updating message read status:', error);
    throw error;
  }
};

// ----- Role Change Requests -----
export const getRoleChangeRequests = async () => {
  try {
    const res = await API.get("/admin/role-change-requests");
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Error fetching role change requests";
  }
};

export const updateUserRole = async (userId, newRole) => {
  try {
    const res = await API.put(`/admin/update-role/${userId}`, { newRole });
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Error updating user role";
  }
};
