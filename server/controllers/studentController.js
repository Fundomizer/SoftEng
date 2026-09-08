import db from "../db.js";

// Get student's available tokens
export const getTokens = async (req, res) => {
  try {
    const [students] = await db.query(
      "SELECT available_tokens FROM students WHERE id = ?",
      [req.params.id],
    );

    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ tokens: students[0].available_tokens });
  } catch (error) {
    console.error("Get tokens error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all students' print jobs for global queue view (anonymized)
export const getQueueAll = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT id, job_number, document_name, document_filename, num_pages, num_copies,
              color_mode, paper_size, has_images, token_cost, status, rejection_reason,
              submitted_at, reviewed_at, student_id
       FROM print_jobs
       WHERE status IN ('pending', 'approved')
       ORDER BY submitted_at ASC`,
    );

    res.json(jobs);
  } catch (error) {
    console.error("Get queue error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get student's print jobs (queue)
export const getJobs = async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT id, job_number, document_name, document_filename, num_pages, num_copies,
              color_mode, paper_size, has_images, token_cost, status, rejection_reason,
              submitted_at, reviewed_at
       FROM print_jobs
       WHERE student_id = ?
       ORDER BY submitted_at ASC`,
      [req.params.id],
    );

    res.json(jobs);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Submit new print job (with file upload)
export const submitJob = async (req, res) => {
  const {
    documentName,
    numPages,
    numCopies,
    colorMode,
    paperSize,
    hasImages,
    tokenCost,
  } = req.body;
  const documentFilename = req.file
    ? req.file.filename
    : req.body.documentFilename;

  try {
    // Check if student has enough tokens
    const [students] = await db.query(
      "SELECT available_tokens FROM students WHERE id = ?",
      [req.params.id],
    );

    if (students.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (students[0].available_tokens < tokenCost) {
      return res.status(400).json({ error: "Insufficient tokens" });
    }

    // Generate job number
    const [lastJob] = await db.query(
      "SELECT job_number FROM print_jobs ORDER BY id DESC LIMIT 1",
    );

    let jobNumber = "000001";
    if (lastJob.length > 0) {
      const lastNumber = parseInt(lastJob[0].job_number);
      jobNumber = String(lastNumber + 1).padStart(6, "0");
    }

    // Insert new job
    await db.query(
      `INSERT INTO print_jobs (job_number, student_id, document_name, document_filename,
                             num_pages, num_copies, color_mode, paper_size, has_images, token_cost)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobNumber,
        req.params.id,
        documentName,
        documentFilename,
        numPages,
        numCopies,
        colorMode,
        paperSize,
        hasImages,
        tokenCost,
      ],
    );

    // Deduct tokens
    await db.query(
      "UPDATE students SET available_tokens = available_tokens - ? WHERE id = ?",
      [tokenCost, req.params.id],
    );

    res.json({ message: "Print job submitted successfully", jobNumber });
  } catch (error) {
    console.error("Submit job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Cancel/Reject a print job (student-initiated)
export const cancelJob = async (req, res) => {
  const { studentId, reason } = req.body;

  try {
    // Get job details to verify ownership and refund tokens
    const [jobs] = await db.query(
      "SELECT student_id, token_cost, status FROM print_jobs WHERE job_number = ?",
      [req.params.jobNumber],
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    const job = jobs[0];

    // Verify the student owns this job
    if (job.student_id !== parseInt(studentId)) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Only allow canceling pending jobs
    if (job.status !== "pending") {
      return res
        .status(400)
        .json({ error: "Only pending jobs can be cancelled" });
    }

    // Reject the job
    await db.query(
      `UPDATE print_jobs 
       SET status = 'rejected', reviewed_at = NOW(), rejection_reason = ?
       WHERE job_number = ?`,
      [reason || "Cancelled by student", req.params.jobNumber],
    );

    // Refund tokens
    await db.query(
      "UPDATE students SET available_tokens = available_tokens + ? WHERE id = ?",
      [job.token_cost, job.student_id],
    );

    res.json({ message: "Job cancelled successfully" });
  } catch (error) {
    console.error("Cancel job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
