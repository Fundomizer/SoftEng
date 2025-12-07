/**
 * ButtonFormGroup Component - Grid of selectable option buttons
 */
export default function ButtonFormGroup({ label, options, selected, onChange, columns }) {
    const columnMap = { 1: "one", 2: "two", 3: "three", 4: "four" };

    return (
        <div id="form-group">
            <label>{label}</label>
            <div id={`option-grid ${columnMap[columns]}-col`}>
                {options.map(({ value, title, subtitle }) => (
                    <button
                        key={value}
                        id="option-btn"
                        className={selected === value ? "selected" : ""}
                        onClick={() => onChange(value)}
                    >
                        <div id="option-title">{title}</div>
                        {subtitle && <div id="option-subtitle">{subtitle}</div>}
                    </button>
                ))}
            </div>
        </div>
    );
}
