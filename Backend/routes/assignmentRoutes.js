import express from "express";
import {
  addBedsToAssignment,
  createAssignment,
getAssignmentExpiryForUser,
getMyAssignments,
removeBedsFromAssignment,
updateAssignment,
updateExpiryDates,
} from "../controllers/assignmentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createAssignment);
router.get("/user/:userId/expiry", protect, getAssignmentExpiryForUser);
// Protected route: any logged-in user can view their assignments
router.get("/my", protect, getMyAssignments);
router.put("/:id", protect, updateAssignment);

router.patch("/:id/expiry", protect, updateExpiryDates);

// new bed management routes
router.patch("/:id/add-beds", protect, addBedsToAssignment);
router.patch("/:id/remove-beds", protect, removeBedsFromAssignment);


export default router;