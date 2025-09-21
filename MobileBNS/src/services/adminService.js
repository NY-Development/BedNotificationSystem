import API from './axios';

// System stats
export const getStats = async () => {
  const res = await API.get('/admin/stats');
  return res.data;
};

// Update data (wards/beds/users)
export const updateData = async (form) => {
  const res = await API.post('/admin/update', form);
  return res.data;
};

// Users
export const getAllUsers = async () => {
  const res = await API.get('/admin/users');
  return res.data;
};

export const getUserById = async (id) => {
  const res = await API.get(`/admin/users/${id}`);
  return res.data;
};

export const updateUserRole = async (id, role) => {
  const res = await API.put(`/admin/users/${id}/role`, { role });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

// Assignments
export const getAllAssignments = async () => {
  const res = await API.get('/admin/assignments');
  return res.data;
};

// Departments
export const getAllDepartments = async () => {
  const res = await API.get('/admin/departments');
  return res.data;
};