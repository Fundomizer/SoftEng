# Get Faxed Print Service Portal - User & Installation Guide

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation Guide](#installation-guide)
4. [First-Time Setup](#first-time-setup)
5. [Starting the Application](#starting-the-application)
6. [User Guide - Student Portal](#user-guide---student-portal)
7. [User Guide - Admin Dashboard](#user-guide---admin-dashboard)

## Quick Start

Already have Node.js and WAMP installed? Here's the fastest path to a running app:

1. **Start WampServer** and wait for its tray icon to turn green (all services running). We only need its MySQL + phpMyAdmin - Apache isn't used by this project.
2. **Import the database** via phpMyAdmin:

   - Open [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/)
   - Click **Import** → **Choose File** → select `database/get_faxed.sql` from the project folder → click **Go**
3. **Install dependencies and configure your `.env`:**

   ```bash
   npm install
   cp .env.example .env
   ```

   (Windows PowerShell: `Copy-Item .env.example .env`)

   Leave `DB_PASSWORD` blank if you haven't changed WAMP's default root password.
4. **Start the backend** (Terminal 1):

   ```bash
   npm run server
   ```
5. **Start the frontend** (Terminal 2):

   ```bash
   npm run dev
   ```

Then open **http://localhost:5173/** in your browser. Log in with a test account from [credentials.md](./credentials.md) (e.g. Student ID `2234534`, password `student123`).

Stuck? Jump to [Troubleshooting](#troubleshooting), or read the detailed walkthrough below.

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

## System Requirement

### Required Software:

- **Node.js** (version 16 or higher) - [Download](https://nodejs.org/)
- **WAMP** (bundles Apache, MySQL, and phpMyAdmin) - [Download](https://www.wampserver.com/en/)

---

## Installation Guide

### Step 1: Install Node.js

1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the installation wizard
4. Verify by opening a terminal/command prompt and typing:

   ```bash
   node --version
   npm --version
   ```

### Step 2: Install WAMP

1. Go to [https://www.wampserver.com/en/](https://www.wampserver.com/en/)
2. Download the version matching your system (32-bit or 64-bit)
3. Run the installer and follow the wizard
4. Launch **WampServer** from the Start Menu

### Step 3: Install Project Dependencies

1. Open a terminal/command prompt in the project folder
2. Run the following command to install all required packages:
   ```bash
   npm install
   ```
3. Wait for the installation to complete (this may take a few minutes)

---

## First-Time Setup

### Step 1: Set Up the Database

Make sure **WampServer is running** (tray icon green, or at least the MySQL service started) before doing this.

#### Option A: Using phpMyAdmin (recommended)

1. Open your browser and go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/) (or left-click the WAMP tray icon → **phpMyAdmin**)
2. Log in with username `root` and your MySQL password (blank by default on a fresh WAMP install)
3. Click the **Import** tab at the top
4. Click **Choose File** and select `database/get_faxed.sql` from your project folder
5. Scroll down and click **Go**
6. You should see a success message, and a new `get_faxed_printing_service` database will appear in the left sidebar

#### Option B: Using WAMP's MySQL Console

1. Left-click the WAMP tray icon → **MySQL** → **MySQL console**
2. Enter your root password when prompted (press Enter if blank)
3. At the `mysql>` prompt, run:

   ```sql
   source database/get_faxed.sql;
   ```

   Use the full path to the file if your console doesn't open in the project folder, e.g. `source D:/School/.../SoftEng/database/get_faxed.sql;`
4. You should see a series of `Query OK` messages confirming the tables and sample data were created

### Step 2: Configure Database Connection

1. Copy `.env.example` to a new file called `.env` (note the dot at the beginning)
2. Open the `.env` file in a text editor
3. Fill in your MySQL password:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=YOUR_MYSQL_PASSWORD
   DB_NAME=get_faxed_printing_service
   PORT=3001
   ```
4. **Important:** Replace `YOUR_MYSQL_PASSWORD` with your actual MySQL root password - leave it blank (`DB_PASSWORD=`) if you're on a fresh WAMP install, since its MySQL root user has no password by default
5. Save the file. `.env` is gitignored, so it stays local to your machine.

### Step 3: Uploads Folder

The `uploads/` folder (where submitted documents are stored) is already part of the project - no setup needed.

---

## Starting the App

### Step 1: Start the Backend Server

1. Open a terminal/command prompt in the project folder
2. Run:
   ```bash
   npm run server
   ```
3. You should see:
   ```
   Server running on http://localhost:3001
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

To expose the website and let other LAN devices connect use the following command:

```bash
npm run dev -- --host
```

### Step 3: Access the Application

1. Open your web browser
2. Go to: **http://localhost:5173/**
3. You should see the Student Login page

---

## User Guide - Student Portal

#### Test Accounts:

- **Student ID:** `2234534` | **Password:** `student123` | **Name:** Alice Johnson | **Tokens:** 250
- **Student ID:** `2234535` | **Password:** `student123` | **Name:** Bob Smith | **Tokens:** 180
- **Student ID:** `2234536` | **Password:** `student123` | **Name:** Carol Williams | **Tokens:** 320

### Dashboard Overview

### Uploading and Submitting a Print Job

1. **Click the "Upload" tab**
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

---


## Version Information

- **Application Version:** 0.0.0
- **Node.js Required:** 16+
- **WAMP Required:** any version bundling MySQL 8.0+
- **React Version:** 19.1.1
