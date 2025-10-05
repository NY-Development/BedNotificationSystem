import API from "./axios";

// ----- System stats -----
export const getStats = async () => {
  const res = await API.get("/admin/stats");
  return res.data;
};

// ----- Users -----
export const getAllUsers = async () => {
  const res = await API.get("/admin/users");
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

// ----- Assignments -----
export const getAllAssignments = async () => {
  const res = await API.get("/admin/assignments");
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
