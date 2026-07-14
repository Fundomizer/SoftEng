import bcrypt from "bcryptjs";
import db from "../db.js";

// Student/Admin Login
export const login = async (req, res) => {
  const { adminId, id, password } = req.body;

  if (!password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  try {
    // Try student login first
    const [studentRows] = await db.query(
      `SELECT u.id, u.email, u.user_type, u.password_hash, s.id AS student_id, s.student_id AS student_number,
              s.first_name, s.last_name, s.available_tokens
       FROM users u
       JOIN students s ON u.id = s.user_id
       WHERE s.student_id = ? AND u.user_type = 'student'`,
      [id],
    );

    if (studentRows.length > 0) {
      const user = studentRows[0];
      const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      return res.json({
        role: "student",
        id: user.student_id,
        studentNumber: user.student_number,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        tokens: user.available_tokens,
      });
    }

    // Try admin login next
    const [adminRows] = await db.query(
      `SELECT u.id, u.email, u.user_type, u.password_hash, a.id AS admin_id, a.admin_id AS admin_number,
              a.first_name, a.last_name
       FROM users u
       JOIN admins a ON u.id = a.user_id
       WHERE a.admin_id = ?`,
      [adminId],
    );

    if (adminRows.length > 0) {
      const user = adminRows[0];
      const passwordMatches = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      return res.json({
        role: "admin",
        id: user.admin_id,
        adminNumber: user.admin_number,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      });
    }

    // If neither student nor admin matched
    return res.status(401).json({ error: "Invalid credentials" });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
