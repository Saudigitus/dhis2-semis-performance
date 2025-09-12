import { format } from 'date-fns';
import { useRecoilState } from 'recoil';
import SimpleField from './SimpleField';
import { useEffect, useMemo, useState } from 'react';
import useSaveMarks from '../../hooks/marks/useSaveMarks';
import { EnrollmentStatus, TableDataRefetch } from 'dhis2-semis-types';
import { formatMarksToSave } from '../../utils/marks/formatMarksToPost';
import { RulesEngine, useUploadEvents, useUrlParams } from 'dhis2-semis-functions';

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
    const { programStage, schoolName } = urlParameters
    const { dataElements, value, otherProps, program, originalData } = props;
    const [values, setValues] = useState({ ...value })

    const { uploadValues } = useUploadEvents()
    const { saveMarks, error, loading, success } = useSaveMarks()

    const memoizedValues = useMemo(() => values, [JSON.stringify(values)]);
    const memoizedDataElements = useMemo(() => [dataElements], [JSON.stringify(dataElements)]);

    const { runRulesEngine, updatedVariables } = RulesEngine({
        values: memoizedValues, program: program, type: "programStage", variables: memoizedDataElements as any,
    })

    const [newMark, setNewMark] = useState(updatedVariables[0].value)
    const [refetch, setRefetch] = useRecoilState(TableDataRefetch);

    useEffect(() => {
        runRulesEngine({overrideValues: memoizedValues, overrideVariables: memoizedDataElements as any})
    }, [value, newMark])

    const handleChange = (e: any) => {
        const newValue = e.target.value
        setNewMark(newValue)

        // Update the values in the state
        setValues((prevValues) => ({
            ...prevValues,
            [dataElements.id]: newValue
        }))

        runRulesEngine({overrideValues: memoizedValues, overrideVariables: memoizedDataElements as any})
    }

    const handleBlur = async (e: any) => {
        if (!values?.programStageEvent) {
            const data = {
                events: [{
                    notes: [],
                    status: "COMPLETED",
                    orgUnitName: schoolName!,
                    orgUnit: value?.orgUnitId,
                    program: value?.programId,
                    programStage: programStage!,
                    event: value?.programStageEvent,
                    enrollment: value?.enrollmentId,
                    trackedEntity: value?.trackedEntity,
                    occurredAt: format(new Date(), "yyyy-MM-dd"),
                    scheduledAt: format(new Date(), "yyyy-MM-dd"),
                    dataValues: [{ value: newMark, dataElement: dataElements?.id }]
                }]
            }

            await uploadValues(data, "COMMIT", "CREATE_AND_UPDATE")
                .then(() => setRefetch(!refetch))
        }
        else {
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
                    .catch(() => {
                        setTimeout(() => {
                            setNewMark(updatedVariables[0].value);
                            originalData[dataElements.id] = updatedVariables[0].value;
                        }, 3000)
                    })
            }
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