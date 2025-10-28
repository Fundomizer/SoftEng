import { useState } from 'react'
import { LoginPage } from './pages/login/LoginPage'
import { StudentPage } from './pages/student/StudentPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('student') // Change to 'login' if you want to start with login page

  return (
    <>
      {currentPage === 'login' && <LoginPage label="Student ID" inputType="text" />}
      {currentPage === 'student' && <StudentPage />}
    </>
  )
}

export default App
