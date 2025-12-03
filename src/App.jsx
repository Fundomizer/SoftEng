import { Routes, Route } from 'react-router-dom'
import {LoginPage} from './pages/login/LoginPage'
import {AdminLogin} from './pages/Admin/AdminLogin'
import {AdminDashboard} from './pages/Admin/AdminDashboard'
import {StudentPage} from './pages/student/StudentPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Routes>
  )
}

export default App
