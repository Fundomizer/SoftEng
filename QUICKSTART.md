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

### Step 3: Install Dependencies
```bash
npm install
```

This will install all required packages including Express, MySQL2, CORS, Multer, and React dependencies.

### Step 4: Configure Database Connection
Create a `.env` file in the project root:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=printing_service
PORT=3001
```

### Step 5: Start Backend Server
Open Terminal 1:
```bash
npm run server
```

You should see: `Server running on http://localhost:3001`

### Step 6: Start Frontend
Open Terminal 2:
```bash
npm run dev
```

Visit: `http://localhost:5173`

#### Optional

To expose the website and let other LAN devices connect use the following command:

```bash
npm run dev -- --host
```

You should see:

```
  VITE v7.3.6  ready in 280 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.56.1:5173/
  ➜  Network: http://<LOCAL_IP>:5173/
  ➜  press h + enter to show help

```


## 🔑 Test Login Credentials

### Student Account
- **Student ID:** `2234534`
- **Password:** `student123`

### Admin Account
- **Admin ID:** `ADM001`
- **Password:** `admin123`

## ✨ Features

### Student Portal
- 📤 Upload documents (PDF, DOC, DOCX) with drag-and-drop support
- 📋 View print job queue with status-based color coding
- 📜 Track complete print history
- 🎫 Real-time token balance and cost estimation
- ❌ Cancel pending print jobs
- 📊 Dynamic status badges (Pending, Approved, Printed, Rejected)

### Admin Dashboard
- 📊 Real-time statistics dashboard
- ✅ Approve/reject print requests
- 📝 Provide rejection reasons
- 🖨️ Mark jobs as printed
- 📄 View uploaded documents in new tab
- 🔍 Filter jobs by status (Pending, Approved, Printed, Rejected)

## 🎨 Recent Updates

- ✅ File upload functionality with actual file storage
- ✅ Status-based color coding for print job cards
- ✅ Dynamic status badges in history view
- ✅ Pagination highlighting fixed
- ✅ View documents in new tab from admin dashboard
- ✅ Code cleanup and simplification
- ✅ Removed unused imports and redundant code
- ✅ Simplified component structure

## 📁 Project Structure

```
SoftEng/
├── database/
│   └── schema.sql          # Database schema with sample data
├── server/
│   ├── index.js            # Express API server
│   └── db.js               # MySQL connection
├── src/
│   ├── components/         # Reusable components
│   ├── pages/              # Page components
│   └── styles/             # CSS stylesheets
├── uploads/                # Uploaded documents storage
└── .env                    # Configuration (create this)
```

## 🔧 Troubleshooting

### Cannot connect to database
- Verify MySQL is running
- Check `.env` credentials are correct
- Ensure database was created successfully

### Port already in use
- Change PORT in `.env` to different number (e.g., 3002)
- Update `vite.config.js` proxy target if needed

### File upload issues
- Ensure `uploads/` directory exists
- Check file size is under 10MB
- Verify file type is PDF, DOC, or DOCX

## ❓ Need More Help?

See `DATABASE_SETUP.md` for detailed setup instructions and API documentation.
