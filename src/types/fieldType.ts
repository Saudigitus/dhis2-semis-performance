export type SimpleFieldProps = {
    field: any;
    error?: boolean;
    content: string;
    loading: boolean;
    warning?: boolean;
    success?: boolean;
    visible?: boolean;
    disabled?: boolean;
    value: string | number;
    handleBlur: () => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | string | number | null | undefined) => void;
};



/* ────────────────────────────── Types ────────────────────────────── */

export interface SingleSelectOption {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface SingleSelectProps {
    /** Unique HTML id */
    id?: string;
    /** Label displayed above the select */
    label?: string;
    /** Currently selected value (controlled) */
    value?: string | number;
    /** Placeholder when nothing is selected */
    placeholder?: string;
    /** Array of options */
    options: SingleSelectOption[];
    /** Enable the search/filter input inside the dropdown */
    filterable?: boolean;
    /** Placeholder text inside the search input */
    filterPlaceholder?: string;
    /** Disable the entire component */
    disabled?: boolean;
    /** Use the dense (compact) variant */
    dense?: boolean;
    /** Mark as required (adds * to label) */
    required?: boolean;
    /** Display an error state */
    error?: boolean;
    /** Error message displayed below the select */
    errorText?: string;
    /** Helper text displayed below the select */
    helperText?: string;
    /** Text shown when the filter produces no results */
    noMatchText?: string;
    /** Tab index */
    tabIndex?: number;
    /** Called when the selected value changes */
    handleChange?: (value?: string) => void;
    /** Called when the component loses focus */
    handleBlur?: () => void;
    /** Called when the component receives focus */
    success?: boolean
}