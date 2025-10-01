import express from "express";
import {
  deleteDepartment,
  deleteWard,
  deleteBed,
  addDepartment,
  addWard,
  addBed,
  
} from "../controllers/supervisorController.js";
import { protect, supervisorOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below are protected & supervisor-only
router.use(protect, supervisorOnly);


// Create endpoints
router.post("/departments", addDepartment);
router.post("/departments/:deptId/wards", addWard);
router.post("/departments/:deptId/wards/:wardId/beds", addBed);


router.delete("/departments/:deptId", deleteDepartment);
router.delete("/departments/:deptId/wards/:wardId", deleteWard);
router.delete("/departments/:deptId/wards/:wardId/beds/:bedId", deleteBed);

export default router;
