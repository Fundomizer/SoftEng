# Get Faxed Print Service Portal - User & Installation Guide

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [First-Time Setup](#first-time-setup)
5. [Starting the Application](#starting-the-application)
6. [User Guide - Student Portal](#user-guide---student-portal)
7. [User Guide - Admin Dashboard](#user-guide---admin-dashboard)
8. [Troubleshooting](#troubleshooting)
9. [FAQ](#faq)

---

## Introduction

The **SLU Print Service Portal** is a web-based printing management system designed for students and administrators. It allows students to submit print jobs, track their printing history, and manage their print tokens, while administrators can review, approve, or reject print requests.

### Key Features:

- **Student Portal:**

  - Upload documents (PDF, DOC, DOCX) with drag-and-drop support
  - Submit print jobs with customizable options (B&W/Color, page count, copies)
  - View print job queue with real-time status updates
  - Track complete print history
  - Real-time token balance and cost estimation
  - Cancel pending print jobs
- **Admin Dashboard:**

  - Real-time statistics dashboard
  - Approve/reject print requests
  - Provide rejection reasons
  - Mark jobs as printed
  - View uploaded documents
  - Filter jobs by status

---

## System Requirements

Before installing the application, ensure your computer meets these requirements:

### Required Software:

- **Node.js** (version 16 or higher) - [Download](https://nodejs.org/)
- **MySQL Server** (version 8.0 or higher) - [Download](https://dev.mysql.com/downloads/)
- **Web Browser** (Chrome, Firefox, Edge, or Safari)

### Recommended:

- **Git** - [Download](https://git-scm.com/)
- **Visual Studio Code** or any code editor
- At least **2GB of free RAM**
- At least **500MB of free disk space**

### Operating Systems:

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, Fedora, etc.)

---

## Installation Guide

Follow these steps carefully to install the application from scratch.

### Step 1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the installation wizard
4. After installation, verify by opening a terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```

   Both commands should display version numbers.

### Step 2: Install MySQL

1. Go to [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Download MySQL Community Server for your operating system
3. Run the installer:
   - **Windows:** Use MySQL Installer and select "Developer Default"
   - **macOS:** Use the DMG installer
   - **Linux:** Follow package manager instructions
4. During installation:
   - Set a **root password** (remember this!)
   - Choose "Use Legacy Authentication Method" if prompted
   - Install MySQL Workbench (recommended for easier management)

### Step 3: Get the Project Code

If you have the project as a ZIP file:

1. Extract the ZIP file to your desired location
2. Open a terminal/command prompt in that folder

If you're using Git:

```bash
git clone <repository-url>
cd SoftEng
```

### Step 4: Install Project Dependencies

1. Open a terminal/command prompt in the project folder
2. Run the following command to install all required packages:
   ```bash
   npm install
   ```
3. Wait for the installation to complete (this may take a few minutes)

---

## First-Time Setup

### Step 1: Set Up the Database

#### Option A: Using MySQL Workbench

1. Open **MySQL Workbench**
2. Click on your local MySQL connection (usually "Local instance MySQL80")
3. Enter your root password
4. Go to **File** → **Open SQL Script**
5. Navigate to your project folder and open:
   ```
   database/get_faxed.sql
   ```
6. Click the **lightning bolt icon** (⚡) to execute the script
7. You should see a message confirming the database was created successfully

#### Option B: Using Command Line

1. Open a terminal/command prompt
2. Navigate to your project folder
3. Run the following command:
   ```bash
   mysql -u root -p < database/get_faxed.sql
   ```
4. Enter your MySQL root password when prompted

### Step 2: Configure Database Connection

1. In your project folder, create a new file called `.env` (note the dot at the beginning)
2. Open the `.env` file in a text editor
3. Add the following configuration (adjust values as needed):
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   DB_NAME=get_faxed_printing_service
   PORT=3001
   ```
4. **Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password
5. Save the file

### Step 3: Create Uploads Folder (Optional when upload folder exists in application folder)

The application needs a folder to store uploaded documents:

**Windows (PowerShell):**

```powershell
New-Item -ItemType Directory -Path "uploads" -Force
```

**macOS/Linux (Terminal):**

```bash
mkdir -p uploads
```

---

## Starting the Application

The application has two parts that need to run simultaneously: the backend server and the frontend interface.

### Step 1: Start the Backend Server

1. Open a terminal/command prompt in the project folder
2. Run:
   ```bash
   npm run server
   ```
3. You should see:
   ```
   Server running on http://localhost:3001
   Database connected successfully
   ```
4. **Keep this terminal window open** - the server needs to stay running

### Step 2: Start the Frontend

1. Open a **NEW** terminal/command prompt in the same project folder
2. Run:
   ```bash
   npm run dev
   ```
3. You should see:
   ```
   VITE v7.x.x ready in XXX ms

   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```
4. **Keep this terminal window open** as well

### Step 3: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5173/**
3. You should see the Student Login page

---

## User Guide - Student Portal

### Logging In

1. Go to **http://localhost:5173/**
2. Enter your **Student ID**
3. Enter your **Password**
4. Click **Login**

#### Test Accounts:

- **Student ID:** `2234534` | **Password:** `student123` | **Name:** Alice Johnson | **Tokens:** 250
- **Student ID:** `2234535` | **Password:** `student123` | **Name:** Bob Smith | **Tokens:** 180
- **Student ID:** `2234536` | **Password:** `student123` | **Name:** Carol Williams | **Tokens:** 320

### Dashboard Overview

After logging in, you'll see three main sections at the top:

- **Available Tokens:** Your current token balance
- **Pending Jobs:** Number of print jobs waiting for admin approval
- **Printed Jobs:** Number of successfully completed print jobs

### Uploading and Submitting a Print Job

1. **Click the "Upload" tab** (should be selected by default)
2. **Upload Your Document:**

   - **Drag and drop** your file into the upload area, OR
   - **Click "Browse"** to select a file from your computer
   - Supported formats: PDF, DOC, DOCX
   - Maximum file size: 10MB
3. **Fill in Print Job Details:**

   - **Document Name:** Give your document a descriptive name (e.g., "Assignment 1")
   - **Number of Pages:** Enter the total number of pages to print
   - **Number of Copies:** How many copies you need (default: 1)
   - **Color Mode:**
     - **B&W (Black & White):** 1 token per page
     - **Color:** 2 tokens per page
   - **Paper Size:** Choose between A4 (default) or Letter
   - **Has Images:** Select "Yes" if your document contains images (adds 1 token per page)
4. **Review Token Cost:**

   - The system automatically calculates the total cost
   - **Formula:** `(Base Cost + Images Cost) × Number of Copies`
   - **Base Cost:**
     - B&W: 1 token/page
     - Color: 2 tokens/page
   - **Images Cost:** +1 token/page if "Has Images" is "Yes"
5. **Click "Submit Print Job"**

   - If you have enough tokens, your job will be submitted
   - If you don't have enough tokens, you'll see an error message
   - Tokens are deducted immediately upon submission

### Viewing the Queue

1. **Click the "Queue" tab**
2. You'll see all pending and approved print jobs from all students
3. Each card shows:

   - Job number
   - Document name
   - Student name (yours will have "YOU" badge)
   - Status (color-coded):
     - **Orange:** Pending (waiting for admin review)
     - **Green:** Approved (ready to print)
   - Number of pages, color mode, and token cost
   - Submission date and time
4. **For Your Own Jobs:**

   - Click **"Cancel"** to cancel a pending job
   - Cancelled jobs will refund your tokens

### Viewing Print History

1. **Click the "History" tab**
2. You'll see all your past print jobs with complete details
3. Status indicators:

   - **🟠 Pending:** Waiting for admin approval
   - **🟢 Approved:** Admin has approved, waiting to be printed
   - **🔵 Printed:** Successfully completed
   - **🔴 Rejected:** Admin rejected the request
4. **For Rejected Jobs:**

   - Click to expand and see the rejection reason
   - Your tokens will be refunded automatically
5. **Navigation:**

   - Use the page numbers at the bottom to browse through your history
   - 10 items are shown per page

### Logging Out

1. Click the **"Logout"** button in the top-right corner
2. Confirm logout in the popup
3. You'll be redirected to the login page

---

## User Guide - Admin Dashboard

### Logging In

1. Go to **http://localhost:5173/admin**
2. Enter your **Admin ID**
3. Enter your **Password**
4. Click **Login**

#### Test Account:

- **Admin ID:** `ADM001`
- **Password:** `admin123`
- **Name:** System Administrator

### Dashboard Overview

At the top of the dashboard, you'll see five statistics cards:

- **Total Jobs:** All print jobs in the system
- **Pending:** Jobs waiting for your review
- **Approved:** Jobs you've approved (ready to print)
- **Printed:** Completed jobs
- **Rejected:** Jobs you've rejected

### Managing Print Jobs

The dashboard has four tabs to filter jobs by status:

- **Pending:** Jobs needing your review
- **Approved:** Jobs ready to print
- **Printed:** Completed jobs
- **Rejected:** Jobs that were rejected

### Reviewing a Print Job

Each job card displays:

- **Job Number:** Unique identifier (e.g., #000049)
- **Document Name:** What the student named the document
- **Student Information:** Student ID and full name
- **Print Details:**
  - Number of pages
  - Color mode (B&W or Color)
  - Has images (Yes/No)
  - Token cost
- **Submission Date & Time**

### Actions You Can Take

#### 1. View the Document

- Click **"View Document"** to open the uploaded file in a new browser tab
- Review the document before approving/rejecting

#### 2. Approve a Job (Pending Tab)

- Click the **"Approve" button** (green)
- The job moves to the "Approved" tab
- Student will see the status change in their queue

#### 3. Reject a Job (Pending Tab)

- Click the **"Reject" button** (red)
- A popup will appear asking for a rejection reason
- Enter a clear reason (e.g., "Document is corrupted", "Inappropriate content", "Wrong file uploaded")
- Click **"Submit"**
- The student's tokens will be refunded automatically
- Student will see the rejection reason in their history

#### 4. Mark as Printed (Approved Tab)

- After physically printing the document, click **"Mark as Printed"**
- The job moves to the "Printed" tab
- This completes the print job lifecycle

### Best Practices for Admins

1. **Review documents promptly** - Students are waiting for approval
2. **Provide clear rejection reasons** - Help students understand what went wrong
3. **Verify file content** - Always view the document before approving
4. **Check print settings** - Ensure pages, color mode, and copies match the document
5. **Mark as printed immediately** - Keep the system updated after printing

### Logging Out

1. Click the **profile icon** in the top-right corner
2. Click **"Logout"**
3. Confirm logout in the popup

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**

1. Make sure MySQL is running:
   - **Windows:** Check Services (search "Services" in Start menu)
   - **macOS/Linux:** Run `sudo systemctl status mysql`
2. Verify your `.env` file has correct database credentials
3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

### Issue: "Port 3001 already in use"

**Solution:**

1. Close any other programs using port 3001
2. Or, change the PORT in `.env` file to a different number (e.g., 3002)
3. Restart the server

### Issue: "Module not found" errors

**Solution:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: File uploads not working

**Solution:**

1. Check that the `uploads/` folder exists in your project directory
2. Ensure the folder has write permissions:
   - **Windows:** Right-click folder → Properties → Security
   - **macOS/Linux:** Run `chmod 755 uploads/`

### Issue: "ECONNREFUSED" error on frontend

**Solution:**

1. Make sure the backend server is running (`npm run server`)
2. Check that the server is on port 3001
3. Verify `src/config.js` has correct HOST and PORT settings

### Issue: Database not created/tables missing

**Solution:**

1. Delete the existing database (if any):
   ```sql
   DROP DATABASE IF EXISTS get_faxed_printing_service;
   ```
2. Re-run the SQL script:
   ```bash
   mysql -u root -p < database/get_faxed.sql
   ```

### Issue: Frontend shows blank page

**Solution:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Check browser console for errors (F12)
3. Restart the frontend server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```


---

## Version Information

- **Application Version:** 0.0.0
- **Node.js Required:** 16+
- **MySQL Required:** 8.0+
- **React Version:** 19.1.1
- **Last Updated:** December 2025
