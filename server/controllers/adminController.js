import db from "../db.js";

// Get all print jobs with student info
export const getJobs = async (req, res) => {
  const { status } = req.query;

  try {
    let query = `
      SELECT pj.id, pj.job_number, pj.document_name, pj.document_filename,
             pj.num_pages, pj.num_copies, pj.color_mode, pj.paper_size, pj.has_images,
             pj.token_cost, pj.status, pj.rejection_reason, pj.submitted_at, pj.reviewed_at,
             s.student_id, s.first_name, s.last_name
      FROM print_jobs pj
      JOIN students s ON pj.student_id = s.id
    `;

    const params = [];
    if (status) {
      query += " WHERE pj.status = ?";
      params.push(status);
    }

    query += " ORDER BY pj.submitted_at ASC";

    const [jobs] = await db.query(query, params);
    res.json(jobs);
  } catch (error) {
    console.error("Get admin jobs error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get job counts
export const getStats = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'printed' THEN 1 ELSE 0 END) as printed,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM print_jobs
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Approve print job
export const approveJob = async (req, res) => {
  const { adminId } = req.body;

  try {
    await db.query(
      `UPDATE print_jobs 
       SET status = 'approved', reviewed_at = NOW(), reviewed_by = ?
       WHERE id = ?`,
      [adminId, req.params.id],
    );

    res.json({ message: "Job approved successfully" });
  } catch (error) {
    console.error("Approve job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Reject print job
export const rejectJob = async (req, res) => {
  const { adminId, reason } = req.body;

  try {
    // Get job details to refund tokens
    const [jobs] = await db.query(
      "SELECT student_id, token_cost FROM print_jobs WHERE id = ?",
      [req.params.id],
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Reject job
    await db.query(
      `UPDATE print_jobs 
       SET status = 'rejected', reviewed_at = NOW(), reviewed_by = ?, rejection_reason = ?
       WHERE id = ?`,
      [adminId, reason, req.params.id],
    );

    // Refund tokens
    await db.query(
      "UPDATE students SET available_tokens = available_tokens + ? WHERE id = ?",
      [jobs[0].token_cost, jobs[0].student_id],
    );

    res.json({ message: "Job rejected successfully" });
  } catch (error) {
    console.error("Reject job error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Mark job as printed
export const markPrinted = async (req, res) => {
  try {
    await db.query(
      `UPDATE print_jobs 
       SET status = 'printed', printed_at = NOW()
       WHERE id = ?`,
      [req.params.id],
    );

    res.json({ message: "Job marked as printed" });
  } catch (error) {
    console.error("Mark printed error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
