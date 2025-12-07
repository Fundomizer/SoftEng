import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "../../styles/LoginPageStyle.css"
import { HOST, PORT } from "../../config"

export function AdminLogin() {
    const navigate = useNavigate()
    const [adminId, setAdminId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSignIn = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${HOST}:${PORT}/api/auth`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, password }) // ✅ unified field
            });

            const data = await response.json();

            if (response.ok) {
                if (data.role === 'student') {
                    sessionStorage.setItem('student', JSON.stringify(data));
                    navigate('/student');
                } else if (data.role === 'admin') {
                    sessionStorage.setItem('admin', JSON.stringify(data));
                    navigate('/admin/dashboard');
                } else {
                    setError('Unknown user role');
                }
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Connection error. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <section>
            <div>
                <img src="/src/assets/slu_logo.png" alt="SLU logo" />
                <h1>Saint Louis University</h1>
                <p>Admin Printing Service Portal</p>
            </div>
            <div>
                <div id="Card">
                    <div>
                        <p><span>Welcome Back</span></p>
                        <p>Sign in to manage your print requests to track tokens</p>
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                    <form onSubmit={handleSignIn}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#003366', fontWeight: '500' }}>User ID</label>
                            <input
                                type="text"
                                placeholder="Enter your user ID"
                                value={adminId}
                                onChange={(e) => setAdminId(e.target.value)}
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
                            <img src="/src/assets/icons/login_icon.png" alt="sign in using portal" />
                            {loading ? 'Signing in...' : 'Sign In to Portal'}
                        </button>
                    </form>
                    <p>or</p>
                    <button type="button">
                        <img src="/src/assets/icons/google_icon.png" alt="sign in with google" />
                        Sign in with Google
                    </button>
                    <p style={{ marginTop: '20px', textAlign: 'center' }}>
                        <Link to="/" style={{ color: '#003366', textDecoration: 'underline' }}>
                            Go to Student Portal (Testing)
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
