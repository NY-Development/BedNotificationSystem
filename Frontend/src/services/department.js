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

export const sendPatientInfo = async (info) => {
  try {
    const res = await API.post(`/departments/patient`, info);
    return res.data;
  } catch (err) {
    console.error("Failed to send patient datat", err);
    throw err;
  }
}

export const updatePatientInfo = async (info) => {
  try {
    const res = await API.put(`/departments/update-patient`, info);
    return res.data;
  } catch (err) {
    console.error("Failed to update patient data", err);
    throw err;
  }
}
