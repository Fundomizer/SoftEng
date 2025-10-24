export function TextInput(props) { //{label = "Text", inputType="text", placeholder=""}
    return(
        <>
            <p>{props.label}</p>
            <input type={props.inputType} placeholder={props.placeholder}/>
        </>
    )
}