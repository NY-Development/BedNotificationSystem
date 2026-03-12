import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { predictDiagnosisGEMINI } from "../controllers/geminiController.js";
import { predictDiagnosisGBT } from "../controllers/gbtController.js";
import {predictDiagnosisGROQ} from "../controllers/groqController.js"

const router = express.Router();

router.post("/gemini_predict", protect, predictDiagnosisGEMINI);
router.post("/groq_pedict", protect, predictDiagnosisGROQ);
router.post("/gbt_predict", protect, predictDiagnosisGBT);

export default router