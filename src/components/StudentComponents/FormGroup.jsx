/**
 * InputFormGroup Component - Labeled input field with number validation
 */
export default function InputFormGroup({ type, label, placeholder, value, onChange }) {
    return (
        <div id="form-group">
            <label>{label}</label>
            <input
                type={type}
                id="text-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...(type === "number" && { min: 1 })}
            />
        </div>
    );
}
