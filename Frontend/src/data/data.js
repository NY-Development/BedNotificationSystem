import hospitalImage from '../assets/homeImage.jpg';
import HallWay from '../assets/hospitalHallway.jpg';

const generateBeds = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const isOccupied = Math.random() < 0.5; // 50% chance
    return {
      id: i + 1,
      status: isOccupied ? "occupied" : "available",
      assignedUser: isOccupied
        ? { name: "Assigned User", email: "user@example.com" }
        : null,
    };
  });
};

const hosData = {
  schools: [
    {
      name: "Medicine School",
      image: hospitalImage,
      description: "Comprehensive medical training, patient care, and research.",
      departments: [
        {
          name: "Internal Medicine",
          wards: [
            { name: "Ward C", beds: generateBeds() },
            { name: "Ward D", beds: generateBeds() },
            { name: "Inpatient", beds: generateBeds() },
            { name: "Stroke", beds: generateBeds() },
            { name: "Kalazar", beds: generateBeds() },
          ],
        },
        {
          name: "GynObs",
          wards: [
            { name: "Labor", beds: generateBeds() },
            { name: "M1 up", beds: generateBeds() },
            { name: "M1 down", beds: generateBeds() },
            { name: "M2 (post natal)", beds: generateBeds() },
            { name: "M3 (high risk)", beds: generateBeds() },
            { name: "Gyn ward", beds: generateBeds() },
            { name: "Michu", beds: generateBeds() },
            { name: "Fistula", beds: generateBeds() },
          ],
        },
        {
          name: "Pediatrics",
          wards: [
            { name: "ETAT", beds: generateBeds() },
            { name: "Emergency", beds: generateBeds() },
            { name: "Main ward (under 5 and above 5)", beds: generateBeds() },
            { name: "Nutrition and infant", beds: generateBeds() },
            { name: "Hemato Oncology", beds: generateBeds() },
            { name: "NICU", beds: generateBeds() },
          ],
        },
        {
          name: "Surgery",
          wards: [
            { name: "Trauma EOPD", beds: generateBeds() },
            { name: "Non trauma EOPD", beds: generateBeds() },
            { name: "Recovery", beds: generateBeds() },
            { name: "Surgical ward", beds: generateBeds() },
            { name: "Ortho ward", beds: generateBeds() },
          ],
        },
        {
          name: "Emergency",
          wards: [
            { name: "Red", beds: generateBeds() },
            { name: "Orange", beds: generateBeds() },
            { name: "Yellow", beds: generateBeds() },
          ],
        },
        { name: "Dermatology", wards: [{ name: "Dermatology", beds: generateBeds() }] },
        { name: "Psychiatry", wards: [{ name: "Psychiatry", beds: generateBeds() }] },
        { name: "ENT", wards: [{ name: "ENT", beds: generateBeds() }] },
        { name: "Ophthalmology", wards: [{ name: "Ophthalmology", beds: generateBeds() }] },
      ],
    },
    {
      name: "Lab School",
      image: HallWay,
      description: "Dedicated to clinical laboratory science and diagnostics.",
      departments: [
        {
          name: "Internal Medicine",
          wards: [
            { name: "Ward C", beds: generateBeds() },
            { name: "Ward D", beds: generateBeds() },
            { name: "Inpatient", beds: generateBeds() },
            { name: "Stroke", beds: generateBeds() },
            { name: "Kalazar", beds: generateBeds() },
          ],
        },
        {
          name: "GynObs",
          wards: [
            { name: "Labor", beds: generateBeds() },
            { name: "M1 up", beds: generateBeds() },
            { name: "M1 down", beds: generateBeds() },
            { name: "M2 (post natal)", beds: generateBeds() },
            { name: "M3 (high risk)", beds: generateBeds() },
            { name: "Gyn ward", beds: generateBeds() },
            { name: "Michu", beds: generateBeds() },
            { name: "Fistula", beds: generateBeds() },
          ],
        },
        {
          name: "Pediatrics",
          wards: [
            { name: "ETAT", beds: generateBeds() },
            { name: "Emergency", beds: generateBeds() },
            { name: "Main ward (under 5 and above 5)", beds: generateBeds() },
            { name: "Nutrition and infant", beds: generateBeds() },
            { name: "Hemato Oncology", beds: generateBeds() },
            { name: "NICU", beds: generateBeds() },
          ],
        },
        {
          name: "Surgery",
          wards: [
            { name: "Trauma EOPD", beds: generateBeds() },
            { name: "Non trauma EOPD", beds: generateBeds() },
            { name: "Recovery", beds: generateBeds() },
            { name: "Surgical ward", beds: generateBeds() },
            { name: "Ortho ward", beds: generateBeds() },
          ],
        },
      ],
    },
  ],
};

export default hosData;