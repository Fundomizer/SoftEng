import express from "express";
import upload from "../middleware/upload.js";
import {
  getTokens,
  getQueueAll,
  getJobs,
  submitJob,
  cancelJob,
} from "../controllers/studentController.js";

const router = express.Router();

// GET /api/student/:id/tokens
router.get("/student/:id/tokens", getTokens);

// GET /api/queue/all
router.get("/queue/all", getQueueAll);

// GET /api/student/:id/jobs
router.get("/student/:id/jobs", getJobs);

// POST /api/student/:id/jobs
router.post("/student/:id/jobs", upload.single("document"), submitJob);

// PUT /api/student/jobs/:jobNumber/cancel
router.put("/student/jobs/:jobNumber/cancel", cancelJob);

export default router;
