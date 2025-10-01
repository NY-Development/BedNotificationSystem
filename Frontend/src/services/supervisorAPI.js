import API from "./axios";

// ----- Departments -----
export const getAllDepartments = async () => {
  const res = await API.get("/supervisor/departments");
  return res.data;
};

export const addDepartment = async (name) => {
  const res = await API.post("/supervisor/add-departments", { name });
  return res.data;
};

export const deleteDepartment = async (deptId) => {
  const res = await API.delete(`/supervisor/departments/${deptId}`);
  return res.data;
};

// ----- Wards -----
export const addWard = async (deptId, name) => {
  const res = await API.post(`/supervisor/departments/${deptId}/wards`, { name });
  return res.data;
};

export const deleteWard = async (deptId, wardId) => {
  const res = await API.delete(`/supervisor/departments/${deptId}/wards/${wardId}`);
  return res.data;
};

// ----- Beds -----
export const addBed = async (deptId, wardId, bedData) => {
  const res = await API.post(`/supervisor/departments/${deptId}/wards/${wardId}/beds`, bedData);
  return res.data;
};

export const deleteBed = async (deptId, wardId, bedId) => {
  const res = await API.delete(`/supervisor/departments/${deptId}/wards/${wardId}/beds/${bedId}`);
  return res.data;
};
