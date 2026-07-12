import express from "express";
import {
  getJobs,
  getStats,
  approveJob,
  rejectJob,
  markPrinted,
} from "../controllers/adminController.js";

const router = express.Router();

// GET /api/admin/jobs
router.get("/jobs", getJobs);

// GET /api/admin/stats
router.get("/stats", getStats);

// PUT /api/admin/jobs/:id/approve
router.put("/jobs/:id/approve", approveJob);

// PUT /api/admin/jobs/:id/reject
router.put("/jobs/:id/reject", rejectJob);

// PUT /api/admin/jobs/:id/printed
router.put("/jobs/:id/printed", markPrinted);

export default router;
