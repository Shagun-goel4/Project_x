import express from "express";
import { trackLinkClick, getAnalyticsDashboard } from "../controllers/analytics.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/track/:linkId", trackLinkClick);
router.get("/dashboard", authenticateToken, getAnalyticsDashboard);

export default router;
