import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import db from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const dateStr = now.toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
    cb(null, dateStr + '_' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== Authentication Routes =====

// Student Login
app.post('/api/auth', async (req, res) => {
  const { id, password } = req.body;

  try {
    // Try student login first
    const [studentRows] = await db.query(
      `SELECT u.id, u.email, u.user_type, s.id AS student_id, s.student_id AS student_number,
              s.first_name, s.last_name, s.available_tokens
       FROM users u
       JOIN students s ON u.id = s.user_id
       WHERE s.student_id = ? AND u.user_type = 'student'`,
      [id]
    );

    if (studentRows.length > 0) {
      const user = studentRows[0];

      return res.json({
        role: 'student',
        id: user.student_id,
        studentNumber: user.student_number,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        tokens: user.available_tokens
      });
    }

    // Try admin login next
    const [adminRows] = await db.query(
      `SELECT u.id, u.email, u.user_type, a.id AS admin_id, a.admin_id AS admin_number,
              a.first_name, a.last_name
       FROM users u
       JOIN admins a ON u.id = a.user_id
       WHERE a.admin_id = ? AND u.user_type = 'admin'`,
      [id]
    );

    if (adminRows.length > 0) {
      const user = adminRows[0];

      return res.json({
        role: 'admin',
        id: user.admin_id,
        adminNumber: user.admin_number,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email
      });
    }

    // If neither student nor admin matched
    return res.status(401).json({ error: 'Invalid credentials' });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// ===== Student Routes =====

// Get student's available tokens
app.get('/api/student/:id/tokens', async (req, res) => {
  try {
    const [students] = await db.query(
      'SELECT available_tokens FROM students WHERE id = ?',
      [req.params.id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json({ tokens: students[0].available_tokens });
  } catch (error) {
    console.error('Get tokens error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get student's print jobs (queue)
app.get('/api/student/:id/jobs', async (req, res) => {
  try {
    const [jobs] = await db.query(
      `SELECT id, job_number, document_name, document_filename, num_pages, num_copies,
              color_mode, paper_size, has_images, token_cost, status, rejection_reason,
              submitted_at, reviewed_at
       FROM print_jobs
       WHERE student_id = ?
       ORDER BY submitted_at ASC`,
      [req.params.id]
    );

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit new print job (with file upload)
app.post('/api/student/:id/jobs', upload.single('document'), async (req, res) => {
  const { documentName, numPages, numCopies, colorMode, paperSize, hasImages, tokenCost } = req.body;
  const documentFilename = req.file ? req.file.filename : req.body.documentFilename;

  try {
    // Check if student has enough tokens
    const [students] = await db.query(
      'SELECT available_tokens FROM students WHERE id = ?',
      [req.params.id]
    );

    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (students[0].available_tokens < tokenCost) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Generate job number
    const [lastJob] = await db.query(
      'SELECT job_number FROM print_jobs ORDER BY id DESC LIMIT 1'
    );

    let jobNumber = '000001';
    if (lastJob.length > 0) {
      const lastNumber = parseInt(lastJob[0].job_number);
      jobNumber = String(lastNumber + 1).padStart(6, '0');
    }

    // Insert new job
    await db.query(
      `INSERT INTO print_jobs (job_number, student_id, document_name, document_filename,
                               num_pages, num_copies, color_mode, paper_size, has_images, token_cost)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [jobNumber, req.params.id, documentName, documentFilename, numPages, numCopies, colorMode, paperSize, hasImages, tokenCost]
    );

    // Deduct tokens
    await db.query(
      'UPDATE students SET available_tokens = available_tokens - ? WHERE id = ?',
      [tokenCost, req.params.id]
    );

    res.json({ message: 'Print job submitted successfully', jobNumber });
  } catch (error) {
    console.error('Submit job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel/Reject a print job (student-initiated)
app.put('/api/student/jobs/:jobNumber/cancel', async (req, res) => {
  const { studentId, reason } = req.body;

  try {
    // Get job details to verify ownership and refund tokens
    const [jobs] = await db.query(
      'SELECT student_id, token_cost, status FROM print_jobs WHERE job_number = ?',
      [req.params.jobNumber]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = jobs[0];

    // Verify the student owns this job
    if (job.student_id !== parseInt(studentId)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Only allow canceling pending jobs
    if (job.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending jobs can be cancelled' });
    }

    // Reject the job
    await db.query(
      `UPDATE print_jobs 
       SET status = 'rejected', reviewed_at = NOW(), rejection_reason = ?
       WHERE job_number = ?`,
      [reason || 'Cancelled by student', req.params.jobNumber]
    );

    // Refund tokens
    await db.query(
      'UPDATE students SET available_tokens = available_tokens + ? WHERE id = ?',
      [job.token_cost, job.student_id]
    );

    res.json({ message: 'Job cancelled successfully' });
  } catch (error) {
    console.error('Cancel job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ===== Admin Routes =====

// Get all print jobs with student info
app.get('/api/admin/jobs', async (req, res) => {
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
      query += ' WHERE pj.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pj.submitted_at ASC';

    const [jobs] = await db.query(query, params);
    res.json(jobs);
  } catch (error) {
    console.error('Get admin jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job counts
app.get('/api/admin/stats', async (req, res) => {
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
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Approve print job
app.put('/api/admin/jobs/:id/approve', async (req, res) => {
  const { adminId } = req.body;

  try {
    await db.query(
      `UPDATE print_jobs 
       SET status = 'approved', reviewed_at = NOW(), reviewed_by = ?
       WHERE id = ?`,
      [adminId, req.params.id]
    );

    res.json({ message: 'Job approved successfully' });
  } catch (error) {
    console.error('Approve job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject print job
app.put('/api/admin/jobs/:id/reject', async (req, res) => {
  const { adminId, reason } = req.body;

  try {
    // Get job details to refund tokens
    const [jobs] = await db.query(
      'SELECT student_id, token_cost FROM print_jobs WHERE id = ?',
      [req.params.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Reject job
    await db.query(
      `UPDATE print_jobs 
       SET status = 'rejected', reviewed_at = NOW(), reviewed_by = ?, rejection_reason = ?
       WHERE id = ?`,
      [adminId, reason, req.params.id]
    );

    // Refund tokens
    await db.query(
      'UPDATE students SET available_tokens = available_tokens + ? WHERE id = ?',
      [jobs[0].token_cost, jobs[0].student_id]
    );

    res.json({ message: 'Job rejected successfully' });
  } catch (error) {
    console.error('Reject job error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark job as printed
app.put('/api/admin/jobs/:id/printed', async (req, res) => {
  try {
    await db.query(
      `UPDATE print_jobs 
       SET status = 'printed', printed_at = NOW()
       WHERE id = ?`,
      [req.params.id]
    );

    res.json({ message: 'Job marked as printed' });
  } catch (error) {
    console.error('Mark printed error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve uploaded documents
app.get('/api/documents/:filename', (req, res) => {
  const filename = req.params.filename;
  const uploadsPath = path.join(__dirname, '..', 'uploads', filename);

  // Check if file exists and serve it
  res.sendFile(uploadsPath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(404).json({ error: 'Document not found' });
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
