import Department from "../models/Department.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";
import Notification from "../models/Notification.js";
import PatientHistory from "../models/PatientHistory.js";


// Get all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate({
      path: "wards.beds.assignedUser", //  populate nested reference
      select: "name email role",       // only bring what you need
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single department
export const getDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) return res.status(404).json({ message: "Department not found" });
    res.json(dept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient info in a specific bed
export const getBedPatient = async (req, res) => {
  const { deptId, wardName, bedId } = req.params;

  const department = await Department.findById(deptId);
  const ward = department.wards.find(w => w.name === wardName);
  const bed = ward.beds.find(b => b.id === Number(bedId));

  return res.json({
    bedId: bed.id,
    patient: bed.patient,
  });
};

// Admit patient
export const admitPatient = async (req, res) => {
  try {
    const { deptId, wardName, bedId } = req.body;
    const userId = req.user._id;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find((b) => b.id === bedId);
    if (!bed) return res.status(404).json({ message: "Bed not found" });

    // If no assigned user → stop
    if (!bed.assignedUser) {
      return res.status(400).json({ bed, message: "No user assigned to this bed. Can't send notification." });
    }

    // If the clicking user is the assigned one → stop
   if (String(bed.assignedUser) === String(userId)) {
      return res.status(400).json({ message: "You cannot notify yourself." });
  }


    // Get assigned user details
    const assignedUser = await User.findById(bed.assignedUser);

    // Update bed status
    bed.status = "occupied";
    await department.save();

    // Send email notification
    await sendEmail(
      assignedUser.email,
      "Patient Admission Notification",
      `A patient was admitted to Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`
    );
    await Notification.create({
      user: assignedUser._id,
      from: req.user._id,
      type: "admit",
      bedId: bed.id,
      wardName: ward.name,
      departmentName: department.name,
      message: `A patient was admitted to Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`,
    });

    return res.json({ message: `Patient admitted. Notification sent to ${assignedUser.email}` });
  } catch (error) {
    console.error("admitPatient error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Record patient info in a bed
export const recordPatientInBed = async (req, res) => {
  try {
    const { deptId, wardName, bedId, patient } = req.body;
    const userId = req.user?._id;

    if (
      !deptId ||
      !wardName ||
      bedId === undefined ||
      !patient?.name ||
      !patient?.age ||
      !patient?.sex ||
      !patient?.chiefComplaint
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward)
      return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find(b => b.id === Number(bedId));
    if (!bed)
      return res.status(404).json({ message: "Bed not found" });

    //  Store CURRENT patient in bed
    bed.patient = {
      name: patient.name,
      age: patient.age,
      sex: patient.sex,
      chiefComplaint: patient.chiefComplaint,
      prediction: patient.prediction || {},
      admittedAt: new Date(),
    };

    await department.save();

    // STORE HISTORY (NEW)
    await PatientHistory.create({
      department: deptId,
      wardName,
      bedId: Number(bedId),
      patient: {
        name: patient.name,
        age: patient.age,
        sex: patient.sex,
        chiefComplaint: patient.chiefComplaint,
        prediction: patient.prediction || {},
      },
      recordedBy: userId,
    });

    return res.status(201).json({
      message: "Patient info recorded and history saved",
      bed: {
        id: bed.id,
        patient: bed.patient,
      },
    });

  } catch (error) {
    console.error("recordPatientInBed error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update patient info in a bed (and save history)
export const updatePatientInBed = async (req, res) => {
  try {
    const { deptId, wardName, bedId, patient } = req.body;
    const userId = req.user?._id;

    if (
      !deptId ||
      !wardName ||
      bedId === undefined ||
      !patient
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward)
      return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find(b => b.id === Number(bedId));
    if (!bed)
      return res.status(404).json({ message: "Bed not found" });

    if (!bed.patient) {
      return res.status(400).json({ message: "No patient currently assigned to this bed" });
    }

    // Update current patient 
    bed.patient = {
      ...bed.patient,
      ...patient,
      updatedAt: new Date(),
    };

    await department.save();

    //Save update to history 
    await PatientHistory.create({
      department: deptId,
      wardName,
      bedId: Number(bedId),
      patient: {
        name: bed.patient.name,
        age: bed.patient.age,
        sex: bed.patient.sex,
        chiefComplaint: bed.patient.chiefComplaint,
        prediction: bed.patient.prediction || {},
      },
      recordedBy: userId,
      action: "update",
    });

    return res.json({
      message: "Patient record updated successfully",
      bed: {
        id: bed.id,
        patient: bed.patient,
      },
    });

  } catch (error) {
    console.error("updatePatientInBed error:", error);
    res.status(500).json({ error: error.message });
  }
};




// Discharge patient
export const dischargePatient = async (req, res) => {
  try {
    const { deptId, wardName, bedId } = req.body;
    const userId = req.user._id;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bed = ward.beds.find((b) => b.id === bedId);
    if (!bed) return res.status(404).json({ message: "Bed not found" });

    // If no assigned user → stop
    if (!bed.assignedUser) {
      return res.status(400).json({ message: "No user assigned to this bed. Can't send notification." });
    }

    // If the clicking user is the assigned one → stop
    if (bed.assignedUser.toString() === userId.toString()) {
      return res.status(400).json({ message: "You cannot notify yourself." });
    }

    // Get assigned user details
    const assignedUser = await User.findById(bed.assignedUser);

    // Update bed status
    bed.status = "available";
    await department.save();

    // Send email notification
    await sendEmail(
      assignedUser.email,
      "Patient Discharge Notification",
      `Your patient was discharged from Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`
    );
    await Notification.create({
      user: assignedUser._id,
      from: req.user._id,
      type: "discharge",
      bedId: bed.id,
      wardName: ward.name,
      departmentName: department.name,
      message: `Your patient was discharged from Bed ${bed.id}, Ward ${ward.name}, Department ${department.name}.`,
    });

    return res.json({ message: `Patient discharged. Notification sent to ${assignedUser.email}` });
  } catch (error) {
    console.error("dischargePatient error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getBedPatientHistory = async (req, res) => {
  const { deptId, wardName, bedId } = req.params;

  const history = await PatientHistory.find({
    department: deptId,
    wardName,
    bedId: Number(bedId),
  }).sort({ recordedAt: -1 });

  res.json(history);
};
