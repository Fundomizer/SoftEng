import { TextInput } from "../../components/TextInput"

export function LoginPage() {
    return (
        <section>
            <div>
                <img src="/src/assets/slu_logo.png" alt="SLU logo" />
                <h1>Saint Louis University</h1>
                <p>Student Printing Services</p>
            </div>
            <div>
                <h1>Welcome Back</h1>
                <p>Sign in to manage your print requests to track tokens</p>
                <TextInput label="Student ID" inputType="text" placeholder="Enter your student ID" />
                <TextInput label="Password" inputType="password" placeholder="Enter your password" />
                <p><a href="">Forgot password?</a></p>
                <button>
                    <img src="/src/assets/icons/google_icon.png" alt="sign in icon" />
                    <span>Sign in to portal</span>
                </button>
                <p>or</p>
                <button>
                    <img src="/src/assets/icons/login_icon.png" alt="sign in using google" />
                    <span>Sign in to portal</span>
                </button>
            </div>
        </section>
    )
}
