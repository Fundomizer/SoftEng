/**
 * OptionGroup Component
 *
 * Renders a form group with a label and a grid of selectable option buttons.
 * Each option can have a title, optional subtitle/cost, and a unique value.
 * The number of buttons is determined by the length of the `options` array.
 *
 * Props:
 * - label {string} : Label displayed above the option group (e.g., "Color Mode").
 * - options {Array} : Array of option objects with:
 *    - value {string}   : Unique key for the option (e.g., "bw", "color").
 *    - title {string}   : Main text displayed on the button.
 *    - subtitle {string?} : Optional secondary text (e.g., size or cost).
 * - selected {string} : Currently selected option value.
 * - onChange {function} : Callback triggered when an option is clicked.
 * - columns {number} : Number of columns in the grid (e.g., 2, 3).
 *
 * Example:
 * <OptionGroup
 *   label="Color Mode"
 *   options={[
 *     { value: "bw", title: "Black & White", subtitle: "1 token/page" },
 *     { value: "color", title: "Color", subtitle: "4 tokens/page" }
 *   ]}
 *   selected={colorMode}
 *   onChange={setColorMode}
 *   columns={2}
 * />
 */
export default function ButtonFormGroup({ label, options, selected, onChange, columns }) {
    const columnMap = { 1: "one", 2: "two", 3: "three", 4: "four" }; //TODO This will be a problem if there are more than 4 columns. Small solution you can do is use "number-to-words" package via `npm install number-to-words`

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
