import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { TextInput } from "../../components/TextInput"
import "../../styles/LoginPageStyle.css"
import sluLogo from "../../assets/slu_logo.png"
import loginIcon from "../../assets/icons/login_icon.png"
import googleIcon from "../../assets/icons/google_icon.png"
import { HOST } from "../../config"

export function LoginPage() {
    const navigate = useNavigate()
    const [studentId, setStudentId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await fetch(`${HOST}:3001/api/auth/student/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ studentId, password })
            })

            const data = await response.json()

            if (response.ok) {
                // Store student info in sessionStorage
                sessionStorage.setItem('student', JSON.stringify(data))
                navigate('/student')
            } else {
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            console.error('Login error:', err)
            setError('Connection error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <section>
            <div>
                <img src={sluLogo} alt="SLU logo" />
                <h1>Saint Louis University</h1>
                <p>Student Printing Services</p>
            </div>
            <div>
                <div id="Card">
                    <div>
                        <p><span>Welcome Back</span></p>
                        <p>Sign in to manage your print requests to track tokens</p>
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#003366', fontWeight: '500' }}>Student ID</label>
                            <input 
                                type="text" 
                                placeholder="Enter your student ID" 
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#003366', fontWeight: '500' }}>Password</label>
                            <input 
                                type="password" 
                                placeholder="Enter your password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>
                        <div>
                            <p><a href="">Forgot password?</a></p>
                        </div>
                        <button type="submit" disabled={loading}>
                            <img src={loginIcon} alt="sign in using portal" />
                            {loading ? 'Signing in...' : 'Sign In to Portal'}
                        </button>
                    </form>
                    <p>or</p>
                    <button type="button">
                        <img src={googleIcon} alt="sign in with google" />
                        Sign in with Google
                    </button>
                    <p style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/admin" style={{ color: '#003366', textDecoration: 'underline' }}>
                            Go to Admin Portal (Testing)
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
