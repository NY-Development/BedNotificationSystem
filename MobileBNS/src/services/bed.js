import API from './axios';

// Get all departments with wards & beds
export const fetchDepartments = async () => {
  const res = await API.get('/departments');
  return res.data;
};

// Admit patient to bed
export const admitPatient = async ({ deptId, wardName, bedId }) => {
  const res = await API.post('/departments/admit', {
    deptId,
    wardName,
    bedId,
  });
  return res.data;
};

// Discharge patient from bed
export const dischargePatient = async ({ deptId, wardName, bedId }) => {
  const res = await API.post('/departments/discharge', {
    deptId,
    wardName,
    bedId,
  });
  return res.data;
};