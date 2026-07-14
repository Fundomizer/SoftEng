# Get Faxed - Student Printing Service Portal

A web-based print job management system built for Saint Louis University. Students submit documents for printing and track them through a token-based queue; admins review, approve, reject, and fulfill those requests from a dashboard.

## Features

**Student Portal**

- Upload documents (PDF, DOC, DOCX) via drag-and-drop
- Configure print options (B&W/Color, page count, copies, paper size) with real-time token cost estimation
- Track submissions through a live queue and full print history
- Cancel pending jobs (tokens are refunded automatically)

**Admin Dashboard**

- Real-time stats on job counts by status
- Approve/reject requests with a required rejection reason
- View uploaded documents before deciding
- Mark approved jobs as printed to close out the job lifecycle

## Tech Stack

- **Frontend:** React 19, React Router, Vite
- **Backend:** Node.js, Express 5
- **Database:** MySQL (via `mysql2`), run locally through WAMP
- **Auth:** bcrypt-hashed passwords
- **File uploads:** Multer

## Getting Started

You'll need [Node.js](https://nodejs.org/) 16+ and [WAMP](https://www.wampserver.com/en/) installed.

```bash
npm install
```

Then follow the full [User Manual](<./Get%20Faxed%20Printing%20Service%20User%20Manual.md>) for detailed installation steps and in-app usage instructions.

Once configured, run the backend and frontend in separate terminals:

```bash
npm run server   # Express API on http://localhost:3001
npm run dev       # Vite dev server on http://localhost:5173
```

Test accounts are listed in [credentials.md](./credentials.md).

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite frontend dev server   |
| `npm run server`  | Start the Express backend API        |
| `npm run build`   | Build the frontend for production    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint over the project          |

## Documentation

- [Get Faxed Printing Service User Manual.md](<./Get%20Faxed%20Printing%20Service%20User%20Manual.md>) - full installation guide and usage instructions
- [credentials.md](./credentials.md) - seeded test accounts

## Contributors

* Abadecio, Robe Roenz S.
* Policarpio, Julian Eymard M.

* Oway, Jesus Jr. B.
* Sabado, Eduardo III B.

* Sarmiento, Alfredo Julienne S.
* Viloria, Faith Arup Glen B.

## License

Copyright (c) 2025-2026 [Copyright Holder Name]. All rights reserved.

This project was developed as part of an academic course requirement at Saint Louis University. See [LICENSE](./LICENSE) for details.
