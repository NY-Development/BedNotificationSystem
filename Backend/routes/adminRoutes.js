import express from "express";
import {
  getAllUsers,
  getUserById,
 
  deleteUser,
  getAllAssignments,
  getAllDepartments,
  getStats,
  updateData,
  deleteDepartment,
  deleteWard,
  deleteBed,
  addDepartment,
  addWard,
  addBed,
  getAllNotifications,
  getAllSubscriptions,
  activateSubscription,
  deactivateSubscription,
  updateUserRole,
  getRoleChangeRequests,
  denyRoleChange,
  deleteAssignment,
  deleteAllUsers,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected & admin-only
router.use(protect, adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.delete("/users/:id", deleteUser);
router.delete("/all", deleteAllUsers);

router.get("/notifications",getAllNotifications );
router.get("/assignments", getAllAssignments);
router.get("/departments", getAllDepartments);
router.get("/role-change-requests", getRoleChangeRequests);

router.get("/stats", getStats);
router.post("/update", updateData);

router.get("/subscriptions",  getAllSubscriptions);
router.put("/:userId/activate", activateSubscription);
router.put("/:userId/deactivate", deactivateSubscription);
router.put("/update-role/:userId",  updateUserRole);
router.put("/deny-role-change/:userId", denyRoleChange);


// Create endpoints
router.post("/departments", addDepartment);
router.post("/departments/:deptId/wards", addWard);
router.post("/departments/:deptId/wards/:wardId/beds", addBed);


router.delete("/departments/:deptId", deleteDepartment);
router.delete("/departments/:deptId/wards/:wardId", deleteWard);
router.delete("/departments/:deptId/wards/:wardId/beds/:bedId", deleteBed);
router.delete("/assignments/:id",deleteAssignment);

export default router;
