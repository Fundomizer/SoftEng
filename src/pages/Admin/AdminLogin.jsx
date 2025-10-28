import { Link, useNavigate } from "react-router-dom"
import { TextInput } from "../../components/TextInput"
import "../../styles/LoginPageStyle.css"

export function AdminLogin() {
    const navigate = useNavigate()

    const handleSignIn = () => {
        navigate('/admin/dashboard')
    }

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
                    <TextInput label="Student ID" inputType="text" placeholder="Enter your student ID" />
                    <TextInput label="Password" inputType="password" placeholder="Enter your password" />
                    <div>
                        <p><a href="">Forgot password?</a></p>
                    </div>
                    <button onClick={handleSignIn}>
                        <img src="/src/assets/icons/login_icon.png" alt="sign in using google" />
                        Sign In to Portal
                    </button>
                    <p>or</p>
                    <button>
                        <img src="/src/assets/icons/google_icon.png" alt="sign in icon" />
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
