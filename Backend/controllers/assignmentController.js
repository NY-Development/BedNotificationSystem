import Department from "../models/Department.js";
import User from "../models/User.js";
import Assignment from "../models/Assignment.js";

/**
 * Create assignment:
 * body: { userId, deptId, wardName, beds: [bedId], deptExpiry, wardExpiry, note }
 * - Validate user / department / ward
 * - Validate beds are available
 * - Mark beds as occupied and assignedUser = userId
 * - Save Department and create Assignment doc
 */

export const createAssignment = async (req, res) => {
  try {
    const {
      deptId,
      wardName,
      beds: bedIds,
      deptExpiry,
      wardExpiry,
      note,
    } = req.body;

    const userFromToken = req.user; // from JWT (may be plain object with id/_id)
    const userId = userFromToken?._id || userFromToken?.id;

    // Basic validations
    if (!deptId || !wardName || !Array.isArray(bedIds) || bedIds.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find(w => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    // Validate that each bedId exists in the ward (BUT do NOT reject occupied beds)
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => String(b.id) === String(bedId));
      if (!bed) {
        return res.status(404).json({ message: `Bed ${bedId} not found in ward ${wardName}` });
      }
      // Note: we intentionally do NOT check bed.status === "occupied" here,
      // because doctors/users should be able to be assigned regardless.
    }

    // Assign beds to this user (set assignedUser). We intentionally do NOT change bed.status.
    for (const bedId of bedIds) {
      const bed = ward.beds.find(b => String(b.id) === String(bedId));
      bed.assignedUser = userId;
    }

    // Save the updated department (with assignedUser changes)
    await department.save();

    // Create Assignment doc
    const assignment = new Assignment({
      user: userId,
      department: department._id,
      ward: ward.name,
      beds: bedIds,
      deptExpiry: deptExpiry ? new Date(deptExpiry) : null,
      wardExpiry: wardExpiry ? new Date(wardExpiry) : null,
      note: note || "",
      createdBy: userId,
    });

    await assignment.save();

    // Mark firstLoginDone on the real user document (only if not already true)
    const userDoc = await User.findById(userId);
    if (userDoc && !userDoc.firstLoginDone) {
      userDoc.firstLoginDone = true;
      await userDoc.save();
    }

    // Return assignment and updated user to frontend (so frontend can refresh context)
    const updatedUser = await User.findById(userId).select("-password");
    return res.json({ message: "Assignment created", assignment, user: updatedUser });
  } catch (err) {
    console.error("createAssignment error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


/**
 * Get latest assignment expiry dates for the logged-in user
 */
export const getAssignmentExpiryForUser = async (req, res) => {
  try {
    const userId = req.user._id; // from JWT/protect middleware

    const latestAssignment = await Assignment.findOne({ user: userId })
      .sort({ createdAt: -1 }) // latest one
      .select("deptExpiry wardExpiry"); // only return expiry fields

    if (!latestAssignment) {
      return res.json(null); // no assignments yet
    }

    return res.json({
      deptExpiry: latestAssignment.deptExpiry,
      wardExpiry: latestAssignment.wardExpiry,
    });
  } catch (err) {
    console.error("getAssignmentExpiryForUser error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};


// Get logged-in user's assignments
export const getMyAssignments = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware

    // populate department details
    const assignments = await Assignment.find({ user: userId })
      .populate("department", "name wards")
      .populate("createdBy", "name email role");

    if (!assignments.length) {
      return res.status(404).json({ message: "No assignments found" });
    }

    // format response with dept, ward, and bed details
    const formattedAssignments = assignments.map((a) => {
      const dept = a.department;

      // find the ward
      const ward = dept.wards.find((w) => w.name === a.ward);

      // get bed objects for the assigned bed ids
      const assignedBeds = ward
        ? ward.beds.filter((b) => a.beds.includes(b.id))
        : [];

      return {
        _id: a._id,
        department: dept.name,
        ward: a.ward,
        beds: assignedBeds,
        deptExpiry: a.deptExpiry,
        wardExpiry: a.wardExpiry,
        note: a.note,
        createdBy: a.createdBy,
        createdAt: a.createdAt,
      };
    });

    res.json(formattedAssignments);
  } catch (error) {
    console.error("getMyAssignments error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Update an assignment (admin or owner)
export const updateAssignment = async (req, res) => {
  try {
    const { id } = req.params; // assignment ID
    const { deptId, wardName, beds: bedIds, deptExpiry, wardExpiry, note } = req.body;

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    
    // - If admin → target is assignment.user
    // - If normal user → only allow updating their own
    let targetUserId;
    if (req.user.role === "admin") {
      targetUserId = assignment.user; // admin can manage any user’s assignments
    } else {
      if (assignment.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not authorized to update this assignment" });
      }
      targetUserId = req.user._id; // user can only manage their own
    }

    const department = await Department.findById(deptId);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === wardName);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    // 🔹 1. Free up ALL old beds across previous assignments of target user
    const userAssignments = await Assignment.find({ user: targetUserId });
    for (const a of userAssignments) {
      const dept = await Department.findById(a.department);
      if (dept) {
        const oldWard = dept.wards.find((w) => w.name === a.ward);
        if (oldWard) {
          for (const bedId of a.beds) {
            const bed = oldWard.beds.find((b) => b.id === bedId);
            if (bed) {
              bed.status = "available";
              bed.assignedUser = null;
            }
          }
          await dept.save();
        }
      }
    }

    // 🔹 2. Delete all previous assignments for this user (except the one being updated)
    await Assignment.deleteMany({
      user: targetUserId,
      _id: { $ne: assignment._id },
    });

    // 🔹 3. Validate new beds availability
    const unavailableBeds = [];
    for (const bedId of bedIds) {
      const bed = ward.beds.find((b) => b.id === bedId);
      if (!bed) return res.status(404).json({ message: `Bed ${bedId} not found in ward ${wardName}` });
      if (bed.status === "occupied") unavailableBeds.push(bedId);
    }
    if (unavailableBeds.length) {
      return res.status(400).json({
        message: `Beds already occupied: ${unavailableBeds.join(", ")}`,
      });
    }

    // 🔹 4. Assign new beds
    for (const bedId of bedIds) {
      const bed = ward.beds.find((b) => b.id === bedId);
      bed.status = "occupied";
      bed.assignedUser = targetUserId;
    }
    await department.save();

    // 🔹 5. Update current assignment
    assignment.department = department._id;
    assignment.ward = wardName;
    assignment.beds = bedIds;
    assignment.deptExpiry = deptExpiry ? new Date(deptExpiry) : assignment.deptExpiry;
    assignment.wardExpiry = wardExpiry ? new Date(wardExpiry) : assignment.wardExpiry;
    assignment.note = note || assignment.note;

    await assignment.save();

    return res.json({
      message: "Assignment updated successfully (previous assignments overridden)",
      assignment,
    });
  } catch (err) {
    console.error("updateAssignment error:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};



/**
 * Add beds to an existing assignment
 */
export const addBedsToAssignment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const { id } = req.params; // assignment ID
    const { beds: bedIds } = req.body; // new beds array

    if (!Array.isArray(bedIds) || bedIds.length === 0) {
      return res.status(400).json({ message: "No beds provided" });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Only owner or admin can modify
    if (
      assignment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to modify this assignment" });
    }

    const department = await Department.findById(assignment.department);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === assignment.ward);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    const alreadyAssigned = [];
    for (const bedId of bedIds) {
      const bed = ward.beds.find((b) => b.id === bedId);
      if (!bed) {
        return res.status(404).json({ message: `Bed ${bedId} not found in ward ${ward.name}` });
      }

      if (bed.assignedUser && bed.assignedUser.toString() !== assignment.user.toString()) {
        alreadyAssigned.push(bedId);
      } else {
        bed.assignedUser = assignment.user;
        bed.status = "occupied";
        if (!assignment.beds.includes(bedId)) assignment.beds.push(bedId);
      }
    }

    await department.save();
    await assignment.save();

    if (alreadyAssigned.length) {
      return res.status(400).json({
        message: `Some beds are already assigned to another user: ${alreadyAssigned.join(", ")}`,
      });
    }

    res.json({ message: "Beds added successfully", assignment });
  } catch (err) {
    console.error("addBedsToAssignment error:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Remove beds from an existing assignment
 */
export const removeBedsFromAssignment = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const { id } = req.params;
    const { beds: bedIds } = req.body;

    if (!Array.isArray(bedIds) || bedIds.length === 0) {
      return res.status(400).json({ message: "No beds provided" });
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    if (assignment.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to modify this assignment" });
    }

    const department = await Department.findById(assignment.department);
    if (!department) return res.status(404).json({ message: "Department not found" });

    const ward = department.wards.find((w) => w.name === assignment.ward);
    if (!ward) return res.status(404).json({ message: "Ward not found" });

    for (const bedId of bedIds) {
      const bed = ward.beds.find((b) => b.id === bedId);
      if (bed && bed.assignedUser && bed.assignedUser.toString() === assignment.user.toString()) {
        bed.status = "available";
        bed.assignedUser = null;
        assignment.beds = assignment.beds.filter((b) => b !== bedId);
      }
    }

    await department.save();
    await assignment.save();

    res.json({ message: "Beds removed successfully", assignment });
  } catch (err) {
    console.error("removeBedsFromAssignment error:", err);
    res.status(500).json({ message: err.message });
  }
};
