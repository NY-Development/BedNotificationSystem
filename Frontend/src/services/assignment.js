import API from "./axios";

// Create new assignment
export const createAssignment = async (assignmentData) => {
  const res = await API.post("/assignments/", assignmentData);
  return res.data;
};

// Get expiry dates for a user’s latest assignment
export const getAssignmentExpiryForUser = async (userId) => {
  const res = await API.get(`/assignments/user/${userId}/expiry`);
  return res.data; // { deptExpiry, wardExpiry } or null
};

// General PUT update (used by Assignments.jsx for full overrides)
export const updateAssignment = async (id, data) => {
  const res = await API.put(`/assignments/${id}`, data);
  return res.data;
};

// NEW: Dedicated PATCH endpoint for adding beds
export const addBedsToAssignment = async (assignmentId, bedIds) => {
  // bedIds should be an array of bed IDs (e.g., ['b1', 'b2'])
  const res = await API.patch(`/assignments/${assignmentId}/add-beds`, { beds: bedIds });
  return res.data;
};

// NEW: Dedicated PATCH endpoint for removing beds
export const removeBedsFromAssignment = async (assignmentId, bedIds) => {
  // bedIds should be an array of bed IDs (e.g., ['b1', 'b2'])
  const res = await API.patch(`/assignments/${assignmentId}/remove-beds`, { beds: bedIds });
  return res.data;
};

export const getMyAssignment = async() => {
  const res = await API.get('/assignments/my');
  return res.data;
}