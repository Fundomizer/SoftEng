import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ===== Authentication Routes =====

// Student Login
app.post('/api/auth/student/login', async (req, res) => {
  const { studentId, password } = req.body;
  
  try {
    const [users] = await db.query(
      `SELECT u.id, u.email, u.user_type, s.id as student_id, s.student_id as student_number, 
              s.first_name, s.last_name, s.available_tokens
       FROM users u
       JOIN students s ON u.id = s.user_id
       WHERE s.student_id = ? AND u.user_type = 'student'`,
      [studentId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // In production, compare password hash here
    // For now, accepting any password for demo
    const user = users[0];
    res.json({
      id: user.student_id,
      studentNumber: user.student_number,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      tokens: user.available_tokens
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin Login
app.post('/api/auth/admin/login', async (req, res) => {
  const { adminId, password } = req.body;
  
  try {
    const [users] = await db.query(
      `SELECT u.id, u.email, u.user_type, a.id as admin_id, a.admin_id as admin_number,
              a.first_name, a.last_name
       FROM users u
       JOIN admins a ON u.id = a.user_id
       WHERE a.admin_id = ? AND u.user_type = 'admin'`,
      [adminId]
    );
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    res.json({
      id: user.admin_id,
      adminNumber: user.admin_number,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email
    });
  } catch (error) {
    console.error('Admin login error:', error);
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
       ORDER BY submitted_at DESC`,
      [req.params.id]
    );
    
    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit new print job
app.post('/api/student/:id/jobs', async (req, res) => {
  const { documentName, documentFilename, numPages, numCopies, colorMode, paperSize, hasImages, tokenCost } = req.body;
  
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
    
    query += ' ORDER BY pj.submitted_at DESC';
    
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
