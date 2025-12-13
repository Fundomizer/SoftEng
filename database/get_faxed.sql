-- Database Schema for Student Printing Service Portal
-- This schema stores all user data, print jobs, and history

-- Create database
CREATE DATABASE IF NOT EXISTS get_faxed_printing_service;
USE get_faxed_printing_service;

-- Users table (base table for both students and admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_user_type (user_type)
);

-- Students table (extends users)
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    available_tokens INT DEFAULT 250,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_student_id (student_id),
    INDEX idx_user_id (user_id)
);

-- Admins table (extends users)
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    admin_id VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_admin_id (admin_id),
    INDEX idx_user_id (user_id)
);

-- Print Jobs table
CREATE TABLE IF NOT EXISTS print_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_number VARCHAR(20) NOT NULL UNIQUE,
    student_id INT NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    document_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    num_pages INT NOT NULL,
    num_copies INT DEFAULT 1,
    color_mode ENUM('bw', 'color') DEFAULT 'bw',
    paper_size VARCHAR(10) DEFAULT 'a4',
    has_images ENUM('yes', 'no') DEFAULT 'no',
    token_cost INT NOT NULL,
    status ENUM('pending', 'approved', 'printed', 'rejected') DEFAULT 'pending',
    rejection_reason TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by INT NULL,
    printed_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admins(id) ON DELETE SET NULL,
    INDEX idx_job_number (job_number),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status),
    INDEX idx_submitted_at (submitted_at)
);

-- Insert sample data

-- Sample admin user
INSERT INTO users (email, password_hash, user_type) VALUES 
('admin@slu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin'); -- password: admin123

INSERT INTO admins (user_id, admin_id, first_name, last_name) VALUES 
(1, 'ADM001', 'System', 'Administrator');

-- Sample student users
INSERT INTO users (email, password_hash, user_type) VALUES 
('alice.johnson@slu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student'), -- password: student123
('bob.smith@slu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student'),
('carol.williams@slu.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'student');

INSERT INTO students (user_id, student_id, first_name, last_name, available_tokens) VALUES 
(2, '2234534', 'Alice', 'Johnson', 250),
(3, '2234535', 'Bob', 'Smith', 180),
(4, '2234536', 'Carol', 'Williams', 320);

-- Sample print jobs with diverse statuses
INSERT INTO print_jobs (job_number, student_id, document_name, document_filename, num_pages, num_copies, color_mode, paper_size, has_images, token_cost, status, submitted_at) VALUES 
('000049', 1, 'Research Paper - AI Ethics', '20251203_093000_ai-ethics-paper.pdf', 12, 1, 'bw', 'a4', 'yes', 24, 'pending', '2025-12-03 09:30:00'),
('000050', 1, 'Assignment 3 - Data Structures', '20251202_142000_assignment3.pdf', 8, 1, 'bw', 'a4', 'no', 8, 'approved', '2025-12-02 14:20:00'),
('000051', 2, 'Presentation Slides', '20251201_100000_presentation.pdf', 15, 1, 'color', 'a4', 'yes', 60, 'printed', '2025-12-01 10:00:00'),
('000052', 2, 'Final Exam Notes', '20251203_111500_exam-notes.pdf', 20, 1, 'bw', 'a4', 'no', 20, 'pending', '2025-12-03 11:15:00'),
('000053', 3, 'Project Proposal', '20251202_164500_project-proposal.pdf', 6, 2, 'color', 'a4', 'yes', 48, 'approved', '2025-12-02 16:45:00'),
('000054', 2, 'Lab Report - Chemistry', '20251130_110000_chem-lab-report.pdf', 10, 1, 'bw', 'a4', 'yes', 20, 'rejected', '2025-11-30 11:00:00'),
('000055', 3, 'Thesis Chapter 1', '20251129_090000_thesis-ch1.pdf', 25, 1, 'bw', 'a4', 'yes', 50, 'printed', '2025-11-29 09:00:00'),
('000056', 1, 'Course Outline', '20251128_132000_course-outline.pdf', 4, 1, 'bw', 'a4', 'no', 4, 'rejected', '2025-11-28 13:20:00');

-- Update reviewed jobs
UPDATE print_jobs SET reviewed_at = '2025-12-02 15:45:00', reviewed_by = 1 WHERE job_number = '000050';
UPDATE print_jobs SET reviewed_at = '2025-12-01 11:30:00', reviewed_by = 1, printed_at = '2025-12-01 12:00:00' WHERE job_number = '000051';
UPDATE print_jobs SET reviewed_at = '2025-12-02 17:00:00', reviewed_by = 1 WHERE job_number = '000053';
UPDATE print_jobs SET reviewed_at = '2025-11-30 14:30:00', reviewed_by = 1, rejection_reason = 'Document quality is too low. Please resubmit with higher resolution.' WHERE job_number = '000054';
UPDATE print_jobs SET reviewed_at = '2025-11-29 10:15:00', reviewed_by = 1, printed_at = '2025-11-29 11:00:00' WHERE job_number = '000055';
UPDATE print_jobs SET reviewed_at = '2025-11-28 14:00:00', reviewed_by = 1, rejection_reason = 'Document appears to be copyrighted material. Please verify permissions.' WHERE job_number = '000056';
