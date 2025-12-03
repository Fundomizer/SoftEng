# Student Printing Service Portal - Database Setup Guide

## Overview
This application is now connected to a MySQL database. All placeholder data has been moved to the SQL schema.

## Prerequisites
- MySQL Server installed (version 5.7 or higher)
- Node.js installed (version 14 or higher)

## Database Setup Instructions

### 1. Install MySQL
If you don't have MySQL installed, download and install it from:
- Windows: https://dev.mysql.com/downloads/installer/
- Or use XAMPP/WAMP which includes MySQL

### 2. Create the Database
1. Open MySQL Command Line or MySQL Workbench
2. Run the SQL schema file located at `database/schema.sql`:

```bash
# Option 1: Using MySQL Command Line
mysql -u root -p < database/schema.sql

# Option 2: Using MySQL Workbench
# Open schema.sql in MySQL Workbench and execute it
```

This will create:
- Database: `printing_service`
- Tables: `users`, `students`, `admins`, `print_jobs`
- Sample data with test users

### 3. Configure Database Connection
Edit the `.env` file in the project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=printing_service
PORT=3001
```

Replace `your_mysql_password` with your MySQL root password.

## Running the Application

### Start the Backend Server
Open a terminal and run:
```bash
npm run server
```

The server will start on `http://localhost:3001`

### Start the Frontend (in a separate terminal)
```bash
npm run dev
```

The Vite development server will start on `http://localhost:5173`

## Test Credentials

### Student Login
- Student ID: `2234534`
- Password: `student123`
- Name: Alice Johnson
- Available Tokens: 250

### Admin Login
- Admin ID: `ADM001`
- Password: `admin123`
- Name: System Administrator

## API Endpoints

### Authentication
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/admin/login` - Admin login

### Student Routes
- `GET /api/student/:id/tokens` - Get available tokens
- `GET /api/student/:id/jobs` - Get all print jobs
- `POST /api/student/:id/jobs` - Submit new print job

### Admin Routes
- `GET /api/admin/jobs` - Get all print jobs (optional ?status filter)
- `GET /api/admin/stats` - Get job statistics
- `PUT /api/admin/jobs/:id/approve` - Approve a print job
- `PUT /api/admin/jobs/:id/reject` - Reject a print job
- `PUT /api/admin/jobs/:id/printed` - Mark job as printed

## Database Schema

### Users Table
- Stores login credentials for both students and admins
- Fields: id, email, password_hash, user_type

### Students Table
- Stores student-specific information
- Fields: id, user_id, student_id, first_name, last_name, available_tokens

### Admins Table
- Stores admin-specific information
- Fields: id, user_id, admin_id, first_name, last_name

### Print Jobs Table
- Stores all print job requests
- Fields: id, job_number, student_id, document_name, document_filename, num_pages, num_copies, color_mode, paper_size, has_images, token_cost, status, rejection_reason, timestamps

## Troubleshooting

### Cannot connect to database
- Verify MySQL is running
- Check your `.env` file has correct credentials
- Ensure the database was created successfully

### Port already in use
- Change the PORT in `.env` to a different number (e.g., 3002)
- Update `vite.config.js` proxy target if you change the port

### CORS errors
- Ensure both frontend and backend servers are running
- Check that the proxy configuration in `vite.config.js` is correct

## Features Implemented

✅ MySQL database integration
✅ User authentication (students and admins)
✅ Print job submission with token validation
✅ Admin approval/rejection workflow
✅ Job status tracking (pending, approved, printed, rejected)
✅ Token management and automatic deduction
✅ Real-time job statistics
✅ Complete removal of placeholder data

## Notes

- Password hashing is simplified for demo purposes. In production, use proper bcrypt hashing.
- File upload functionality currently stores filenames only. Implement actual file storage as needed.
- The design and styling remain unchanged from the original implementation.
