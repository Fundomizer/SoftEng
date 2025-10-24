import "../styles/TextInputStyle.css"

export function TextInput(props) { //{label = "Text", inputType="text", placeholder=""}
    return (
        <div className="InputField">
            <p>{props.label}</p>
            <input type={props.inputType} placeholder={props.placeholder} />
        </div>
    )
}