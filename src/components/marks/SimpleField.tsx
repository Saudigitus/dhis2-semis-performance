import React from 'react';
import { FiAlertCircle, FiAlertTriangle, FiLoader } from 'react-icons/fi';

type SimpleFieldProps = {
    field: any
    error: boolean
    content: string
    loading: boolean
    warning?: boolean
    success?: boolean
    visible?: boolean
    disabled?: boolean
    value: string | number
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function SimpleField(props: SimpleFieldProps) {
    const { visible, loading, error, success, warning, value } = props;
    const { field, disabled, handleChange, handleBlur, content, ...otherProps } = props;

    if (!visible) {
        return null;
    }

    return (
        <React.Fragment>
            <div style={{ position: 'relative' }}>
                <input
                    min={0}
                    {...field}
                    {...otherProps}
                    value={value}
                    key={field.id}
                    type={"number"}
                    onBlur={(e) => handleBlur(e)}
                    onChange={(e) => handleChange(e)}
                    style={{
                        width: "150px",
                        height: "100%",
                        border: error
                            ? '1px solid red'
                            : warning
                                ? '1px solid orange'
                                : success
                                    ? '1px solid green'
                                    : '1px solid #ccc',
                        color: "#333",
                        outline: "none",
                        borderRadius: "4px",
                        boxSizing: "border-box",
                        backgroundColor: "#fff",
                        cursor: disabled ? "not-allowed" : "default",
                        transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                        padding: (error || warning || loading) ? '8px 30px 8px 8px' : '8px',

                    }}
                />
                {loading
                    ? (
                        <FiLoader
                            color="#ccc"
                            size={20}
                            style={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)'
                            }}
                            title={content}
                        />)
                    :
                    (
                        <>
                            {error && (
                                <FiAlertCircle
                                    color="red"
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    title={content}
                                />
                            )}
                            {warning && (
                                <FiAlertTriangle
                                    color="orange"
                                    size={20}
                                    style={{
                                        position: 'absolute',
                                        right: 8,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    title={content}
                                />
                            )}
                        </>
                    )
                }
            </div>

            <div style={{ fontSize: '10px', color: '#6c757d' }}>
                {content}
            </div>
        </React.Fragment>
    );
}