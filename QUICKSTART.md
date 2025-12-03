# Quick Start Guide

## 🚀 Getting Started in 5 Steps

### Step 1: Install MySQL
Download and install MySQL Server from https://dev.mysql.com/downloads/

### Step 2: Create Database
Open MySQL Command Line or MySQL Workbench and run:
```sql
mysql -u root -p < database/schema.sql
```

Or manually execute the `database/schema.sql` file in MySQL Workbench.

### Step 3: Configure Database Connection
Edit the `.env` file in the project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=printing_service
PORT=3001
```

### Step 4: Start Backend Server
Open Terminal 1:
```bash
npm run server
```

You should see: `Server running on http://localhost:3001`

### Step 5: Start Frontend
Open Terminal 2:
```bash
npm run dev
```

Visit: `http://localhost:5173`

## 🔑 Test Login Credentials

### Student Account
- **Student ID:** `2234534`
- **Password:** `student123`

### Admin Account
- **Admin ID:** `ADM001`
- **Password:** `admin123`

## ✅ What Changed

- ✅ All placeholder data removed from React components
- ✅ Data now stored in MySQL database
- ✅ Backend API server created (Express.js)
- ✅ Login authentication working
- ✅ Print job submission working
- ✅ Admin approval/rejection working
- ✅ Token management working
- ✅ **Design unchanged - everything looks exactly the same!**

## 📁 New Files Created

- `server/index.js` - Backend API server
- `server/db.js` - Database connection
- `database/schema.sql` - Database schema with sample data
- `.env` - Configuration file
- `DATABASE_SETUP.md` - Detailed setup instructions
- `CHANGES_SUMMARY.md` - Complete list of changes

## ❓ Need Help?

See `DATABASE_SETUP.md` for detailed instructions and troubleshooting.
