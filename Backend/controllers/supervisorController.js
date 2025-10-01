
import Department from "../models/Department.js";

// Delete a department
export const deleteDepartment = async (req, res) => {
  try {
    const { deptId } = req.params;
    const department = await Department.findByIdAndDelete(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    res.json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("deleteDepartment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Delete a ward from a department
export const deleteWard = async (req, res) => {
  try {
    const { deptId, wardId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    // find ward index
    const wardIndex = department.wards.findIndex(
      (ward) => ward._id.toString() === wardId
    );
    if (wardIndex === -1) return res.status(404).json({ message: "Ward not found" });

    // remove ward
    department.wards.splice(wardIndex, 1);
    await department.save();

    res.json({ message: "Ward deleted successfully", department });
  } catch (error) {
    console.error("deleteWard error:", error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a bed from a ward
export const deleteBed = async (req, res) => {
  try {
    const { deptId, wardId, bedId } = req.params;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.id(wardId);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const bedIndex = ward.beds.findIndex(
      (bed) => bed._id.toString() === bedId
    );
    if (bedIndex === -1) return res.status(404).json({ message: "Bed not found" });

    // remove bed
    ward.beds.splice(bedIndex, 1);
    await department.save();

    res.json({ message: "Bed deleted successfully", ward });
  } catch (error) {
    console.error("deleteBed error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new Department
export const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Department name is required" });

    const department = new Department({ name, wards: [] });
    await department.save();

    res.status(201).json({ message: "Department created successfully", department });
  } catch (error) {
    console.error("addDepartment error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new Ward to a Department
export const addWard = async (req, res) => {
  try {
    const { deptId } = req.params;
    const { name } = req.body;

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    department.wards.push({ name, beds: [] });
    await department.save();

    res.status(201).json({ message: "Ward added successfully", department });
  } catch (error) {
    console.error("addWard error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new Bed to a Ward
export const addBed = async (req, res) => {
  try {
    const { deptId, wardId } = req.params;
    const { id, status } = req.body; // id = bed number, status = optional

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.id(wardId);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    // push new bed
    ward.beds.push({
      id,
      status: status || "available",
      assignedUser: null,
    });

    await department.save();

    res.status(201).json({ message: "Bed added successfully", ward });
  } catch (error) {
    console.error("addBed error:", error);
    res.status(500).json({ error: error.message });
  }
};