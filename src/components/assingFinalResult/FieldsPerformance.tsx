import { useEffect, useState } from 'react';
import { RulesEngine, useUrlParams } from 'dhis2-semis-functions';
import useSaveMarks from '../../hooks/marks/useSaveMarks';
import { FiAlertCircle, FiAlertTriangle } from 'react-icons/fi';
import { formatMarksToSave } from '../../utils/marks/formatMarksToPost';

interface valueType extends Record<string, any> {
    enrollmentId: "VswSZPzgX81"
    orgUnitId: "Shc3qNhrPAz"
    programId: "wQaiD2V27Dp"
    programStageEvent: "Venko4keMtA"
    status: "COMPLETED"
    trackedEntity: "DWMd8vZUFVu"
}

type FieldsPerformancePros = {
    dataElements: any,
    value: valueType,
    otherProps: any,
    program: string
}

export default function FieldsPerformance(props: FieldsPerformancePros) {
    const { dataElements, value, otherProps, program } = props;
    const { saveMarks, error, loading, saved } = useSaveMarks()
    const { urlParameters } = useUrlParams()
    const { programStage } = urlParameters()

    const { runRulesEngine, updatedVariables } = RulesEngine({
        variables: [dataElements] as any,
        values: value,
        type: "programStage",
        program: program
    })

    const [newMark, setNewMark] = useState(updatedVariables[0].value)


    const handleChange = (e: any) => {
        const newValue = e.target.value
        setNewMark(newValue)
        // updatedVariables[0].value = newValue
        runRulesEngine()
    }

    const handleBlur = async (e: any) => {
        const marks = formatMarksToSave({
            newMark: newMark,
            dataElement: dataElements?.id,
            event: {
                orgUnit: value?.orgUnitId,
                program: value?.programId,
                programStage: programStage!,
                enrollment: value?.enrollmentId,
                event: value?.programStageEvent,
                trackedEntity: value?.trackedEntity
            },
        })

        if (newMark != updatedVariables[0].value) {
            await saveMarks(marks)
        }
    }

    useEffect(() => {
        runRulesEngine()
    }, [value])

    return (
        <>
            {updatedVariables[0]?.visible ?
                <>
                    <div style={{ position: 'relative' }}>
                        <input type="number"
                            {...updatedVariables[0]}
                            {...otherProps}
                            value={newMark}
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
                                cursor: updatedVariables[0]?.disabled ? "not-allowed" : "default"

                            }}
                            onChange={handleChange}
                            onBlur={handleBlur}
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