import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// This app is served over a LAN (see QUICKSTART.md's `vite dev --host` step),
// so the frontend's origin varies by device IP - allow private network
// ranges and localhost, but not arbitrary public origins.
const ALLOWED_ORIGIN_PATTERN =
  /^https?:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2})(?::\d+)?$/;

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGIN_PATTERN.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  }),
);
app.use(express.json());

// ===== Authentication Routes =====
app.use("/api/auth", authRoutes);

// ===== Student Routes =====
// Mounted at /api (not /api/student) because this router also owns
// /api/queue/all, which doesn't share the /api/student prefix.
app.use("/api", studentRoutes);

// ===== Admin Routes =====
app.use("/api/admin", adminRoutes);

// Serve uploaded documents
app.get("/api/documents/:filename", (req, res) => {
  const filename = path.basename(req.params.filename);
  const uploadsPath = path.join(__dirname, "..", "uploads", filename);

  // Check if file exists and serve it
  res.sendFile(uploadsPath, (err) => {
    if (err) {
      console.error("Error serving file:", err);
      res.status(404).json({ error: "Document not found" });
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
