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

app.use(cors());
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
  const filename = req.params.filename;
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
