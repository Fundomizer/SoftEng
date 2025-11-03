import { Link, useNavigate } from "react-router-dom"
import { TextInput } from "../../components/TextInput"
import "../../styles/LoginPageStyle.css"
import sluLogo from "../../assets/slu_logo.png"
import loginIcon from "../../assets/icons/login_icon.png"
import googleIcon from "../../assets/icons/google_icon.png"

export function LoginPage() {
    const navigate = useNavigate()

    const handleLogin = () => {
        // Add your authentication logic here
        // For now, it will navigate to student page
        navigate('/student')
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
                    <TextInput label="Student ID" inputType="text" placeholder="Enter your student ID" />
                    <TextInput label="Password" inputType="password" placeholder="Enter your password" />
                    <div>
                        <p><a href="">Forgot password?</a></p>
                    </div>
                    <button onClick={handleLogin}>
                        <img src={loginIcon} alt="sign in using portal" />
                        Sign In to Portal
                    </button>
                    <p>or</p>
                    <button onClick={handleLogin}>
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
