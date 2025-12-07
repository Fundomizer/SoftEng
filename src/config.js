const HOST = `http://${window.location.hostname}`
const PORT = 3001;
const API_BASE = `${HOST.replace(/\/$/, '')}:${PORT}`;

export { HOST, PORT, API_BASE }