import { useState } from 'react'
import { LoginPage } from './pages/login/LoginPage'
import { UploadPage } from './pages/student/UploadPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('upload') // Change to 'login' if you want to start with login page

  return (
    <>
      {currentPage === 'login' && <LoginPage label="Student ID" inputType="text" />}
      {currentPage === 'upload' && <UploadPage />}
    </>
  )
}

export default App
