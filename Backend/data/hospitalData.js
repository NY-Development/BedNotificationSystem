import 'dotenv/config'; 
import Department from "../models/Department.js";
import User from "../models/User.js";
import connectDB from "../config/db.js";

const departmentsTemplate = [
  {
    name: "Internal Medicine",
    wards: ["Ward C", "Ward D", "Inpatient", "Stroke", "Kalazar"],
  },
  {
    name: "GynObs",
    wards: ["Labor", "M1 up", "M1 down", "M2 (post natal)", "M3 (high risk)", "Gyn ward", "Michu", "Fistula"],
  },
  {
    name: "Pediatrics",
    wards: ["ETAT", "Emergency", "Main ward (under 5 and above 5)", "Nutrition and infant", "Hemato Oncology", "NICU"],
  },
  {
    name: "Surgery",
    wards: ["Trauma EOPD", "Non trauma EOPD", "Recovery", "Surgical ward", "Ortho ward"],
  },
  {
    name: "Emergency",
    wards: ["Red", "Orange", "Yellow"],
  },
  { name: "Dermatology", wards: ["Dermatology"] },
  { name: "Psychiatry", wards: ["Psychiatry"] },
  { name: "ENT", wards: ["ENT"] },
  { name: "Ophthalmology", wards: ["Ophthalmology"] },
];


const generateBeds = async (users) => {
  return Array.from({ length: 50 }, (_, i) => {
    // Randomly assign status, but assignedUser is always null
    const status = Math.random() < 0.5 ? "occupied" : "available";
    return {
      id: i + 1,
      status,
      assignedUser: null, // always null
    };
  });
};

const seedHospitalData = async () => {
  try {
    await connectDB();
    const users = await User.find(); // get all users

    await Department.deleteMany();

    const departments = [];

    for (const dept of departmentsTemplate) {
      const wards = [];
      for (const wardName of dept.wards) {
        const beds = await generateBeds(users);
        wards.push({ name: wardName, beds });
      }
      departments.push({ name: dept.name, wards });
    }

    await Department.insertMany(departments);
    console.log("✅ Hospital data seeded");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedHospitalData();
