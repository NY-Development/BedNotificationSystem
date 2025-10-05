import API from "./axios";

// Fetch all departments (with wards & beds)
export const getDepartments = async () => {
  try {
    const res = await API.get("/departments");
    return res.data;
  } catch (err) {
    console.error("Failed to fetch departments:", err.response?.data || err.message);
    throw err;
  }
};

// Fetch a single department by ID
export const getDepartment = async (deptId) => {
  try {
    const res = await API.get(`/departments/${deptId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch department:", err.response?.data || err.message);
    throw err;
  }
};
