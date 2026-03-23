import express from "express";
import { getProfile, updateProfile, getPublicProfile } from "../controllers/profile.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateToken, getProfile);
router.put("/", authenticateToken, updateProfile);
router.get("/public/:userId", getPublicProfile);

export default router;
