import API from './axios';

// Create new assignment
export const createAssignment = async (assignmentData) => {
  const res = await API.post('/assignments/', assignmentData);
  return res.data;
};

// Get expiry dates for a user's latest assignment
export const getAssignmentExpiryForUser = async (userId) => {
  const res = await API.get(`/assignments/user/${userId}/expiry`);
  return res.data;
};

export const updateAssignment = async (id, data) => {
  const res = await API.put(`/assignments/${id}`, data);
  return res.data;
};

export const getMyAssignment = async () => {
  const res = await API.get('/assignments/my');
  return res.data;
};