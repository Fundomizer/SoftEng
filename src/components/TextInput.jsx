import "../styles/TextInputStyle.css"

export function TextInput({ label, inputType = "text", placeholder = "" }) {
    return (
        <div className="InputField">
            <p>{label}</p>
            <input type={inputType} placeholder={placeholder} />
        </div>
    )
}