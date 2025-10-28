import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {LoginPage} from './pages/login/LoginPage'
import {AdminLogin} from './pages/Admin/AdminLogin'
import {AdminDashboard} from './pages/Admin/AdminDashboard'
import './App.css'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
