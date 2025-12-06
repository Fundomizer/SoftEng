const HOST = window.location.origin
const PORT = process.env.PORT || 3001;
const API_BASE = `${HOST.replace(/\/$/, '')}:${PORT}`;

export {HOST, PORT, API_BASE}