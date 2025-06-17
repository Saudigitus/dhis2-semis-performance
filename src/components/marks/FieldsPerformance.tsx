import SimpleField from './SimpleField';
import { useEffect, useMemo, useState } from 'react';
import { EnrollmentStatus } from 'dhis2-semis-types';
import useSaveMarks from '../../hooks/marks/useSaveMarks';
import { RulesEngine, useUrlParams } from 'dhis2-semis-functions';
import { formatMarksToSave } from '../../utils/marks/formatMarksToPost';

interface valueType extends Record<string, any> {
    enrollmentId: string
    orgUnitId: string
    programId: string
    programStageEvent: string
    status: EnrollmentStatus
    trackedEntity: string
}

type FieldsPerformancePros = {
    dataElements: any,
    value: valueType,
    otherProps: any,
    program: string
    originalData: any
}

export default function FieldsPerformance(props: FieldsPerformancePros) {
    const { urlParameters } = useUrlParams()
    const { programStage } = urlParameters()
    const { dataElements, value, otherProps, program, originalData } = props;
    const [values, setValues] = useState({ ...value })

    const { saveMarks, error, loading, success } = useSaveMarks()

    const memoizedValues = useMemo(() => values, [JSON.stringify(values)]);

    const { runRulesEngine, updatedVariables } = RulesEngine({
        values: memoizedValues, program: program, type: "programStage", variables: [dataElements] as any,
    })

    const [newMark, setNewMark] = useState(updatedVariables[0].value)

    useEffect(() => {
        runRulesEngine({})
    }, [value, newMark])

    const handleChange = (e: any) => {
        const newValue = e.target.value
        setNewMark(newValue)

        // Update the values in the state
        setValues((prevValues) => ({
            ...prevValues,
            [dataElements.id]: newValue
        }))

        runRulesEngine({})
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

        if (newMark != updatedVariables[0].value && !updatedVariables[0].error) {
            await saveMarks(marks)
                .then(() => {
                    // Update the original data with the new mark
                    updatedVariables[0].value = newMark;
                    originalData[dataElements.id] = newMark;
                })
                .catch((err) => {
                    setTimeout(() => {
                        setNewMark(updatedVariables[0].value);
                        originalData[dataElements.id] = updatedVariables[0].value;
                    }, 3000)
                })
        }
    }

    return (
        <SimpleField
            visible={updatedVariables[0]?.visible}
            loading={loading}
            error={updatedVariables[0]?.error || error}
            success={success}
            warning={updatedVariables[0]?.warning}
            disabled={updatedVariables[0]?.disabled}
            value={newMark}
            handleBlur={handleBlur}
            handleChange={handleChange}
            field={updatedVariables[0]}
            content={updatedVariables[0]?.content || ""}
        />
    );
}