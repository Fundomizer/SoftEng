# SLU Print Service Portal - Test Credentials

## Admin Account

**Admin ID:** `ADM001`
**Password:** Any password (authentication accepts any password for demo)
**Email:** admin@slu.edu
**Name:** System Administrator

---

## Student Accounts

### Student 1 - Alice Johnson
**Student ID:** `2234534`
**Password:** Any password (authentication accepts any password for demo)
**Email:** alice.johnson@slu.edu
**Name:** Alice Johnson
**Available Tokens:** 250

### Student 2 - Bob Smith
**Student ID:** `2234535`
**Password:** Any password (authentication accepts any password for demo)
**Email:** bob.smith@slu.edu
**Name:** Bob Smith
**Available Tokens:** 180

### Student 3 - Carol Williams
**Student ID:** `2234536`
**Password:** Any password (authentication accepts any password for demo)
**Email:** carol.williams@slu.edu
**Name:** Carol Williams
**Available Tokens:** 320


## Application URLs

**Frontend (Vite Dev Server):** http://localhost:5173
**Backend API:** http://localhost:3001
**Student Login:** http://localhost:5173/
**Admin Login:** http://localhost:5173/admin

---

## Notes

- Password authentication is currently disabled for demo purposes - any password will work
- All accounts have sample print jobs with various statuses (pending, approved, printed, rejected)
- Token system is implemented - students lose tokens when submitting jobs and gain them back if rejected
