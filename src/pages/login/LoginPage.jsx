import { TextInput } from "../../components/TextInput"
import "../../styles/LoginPageStyle.css"

export function LoginPage() {
    return (
        <section>
            <div>
                <img src="/src/assets/slu_logo.png" alt="SLU logo" />
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
                    <button>
                        <img src="/src/assets/icons/login_icon.png" alt="sign in using google" />
                        Sign In to Portal
                    </button>
                    <p>or</p>
                    <button>
                        <img src="/src/assets/icons/google_icon.png" alt="sign in icon" />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </section>
    )
}
