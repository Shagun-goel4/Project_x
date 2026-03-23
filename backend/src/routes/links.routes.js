import express from "express";
import { getLinks, createLink, updateLink, deleteLink, bulkUpdateLinkOrder } from "../controllers/links.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken); 

router.get("/", getLinks);
router.post("/", createLink);
router.put("/reorder", bulkUpdateLinkOrder);
router.put("/:id", updateLink);
router.delete("/:id", deleteLink);

export default router;
