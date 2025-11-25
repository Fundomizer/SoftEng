/**
 * FormInput Component
 *
 * Renders a labeled input field with customizable type, label, placeholder, value, and onChange handler.
 * If the input type is "number", a minimum value of 1 is automatically enforced.
 *
 * Props:
 * - type {string}        : Input type (e.g., "text", "number").
 * - label {string}       : Label displayed above the input.
 * - placeholder {string} : Placeholder text inside the input.
 * - value {string|number}: Current value of the input.
 * - onChange {function}  : Callback triggered when the input value changes.
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
                {...(type === "number" ? { min: 1 } : {})}
            />
        </div>
    );
}
