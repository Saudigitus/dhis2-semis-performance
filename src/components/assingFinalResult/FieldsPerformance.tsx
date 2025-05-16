import { RulesEngine } from 'dhis2-semis-functions';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';

export default function FieldsPerformance({ dataElements, value, otherProps, program }: { dataElements: any, value: any, otherProps: any, program: string }) {

    const { runRulesEngine, updatedVariables } = RulesEngine({
        variables: [dataElements] as any,
        values: value,
        type: "programStage",
        program: program
    })

    const handleChange = (e: any) => {
        const newValue = e.target.value
        updatedVariables[dataElements.id] = newValue
        runRulesEngine()
    }

    useEffect(() => {
        runRulesEngine()
    }, [value])

    const [first, setfirst] = useState()
    return (
        <>
            {updatedVariables[0]?.visible ?
                <>
                    <div style={{ position: 'relative' }}>
                        <input type="number"
                            {...updatedVariables[0]}
                            {...otherProps}
                            key={updatedVariables[0].id}
                            style={{
                                width: "150px",
                                height: "100%",
                                border: updatedVariables[0]?.error
                                    ? '1px solid red'
                                    : updatedVariables[0]?.warning
                                        ? '1px solid orange'
                                        : '1px solid #ccc',
                                borderRadius: "4px",
                                padding: '8px 30px 8px 8px',
                                boxSizing: "border-box",
                                color: "#333",
                                backgroundColor: "#fff",
                                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                                outline: "none",

                            }}
                            onChange={handleChange}
                            min="18" max="99"
                        />
                        {updatedVariables[0]?.error && (
                            <FiAlertCircle
                                color="red"
                                size={20}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                                title={updatedVariables[0]?.content}
                            />
                        )}
                        {updatedVariables[0]?.warning && (
                            <FiAlertTriangle
                                color="orange"
                                size={20}
                                style={{
                                    position: 'absolute',
                                    right: 8,
                                    top: '50%',
                                    transform: 'translateY(-50%)'
                                }}
                                title={updatedVariables[0]?.content}
                            />
                        )}
                    </div>
                    <div style={{ fontSize: '10px', color: '#6c757d' }}>
                        {updatedVariables[0]?.content}
                    </div>
                </>
                : null}
        </>
    );
}