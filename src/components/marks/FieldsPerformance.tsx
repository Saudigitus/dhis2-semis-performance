import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import useSaveMarks from '../../hooks/marks/useSaveMarks';
import { EnrollmentStatus, TableDataRefetch } from 'dhis2-semis-types';
import { RulesEngine, useShowAlerts, useUploadEvents, useUrlParams } from 'dhis2-semis-functions';
import { performanceFieldsMapping } from './performanceFieldsMapping';
import { useRecoilState } from 'recoil';

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
    rowDisabled?: boolean
    onEventCreating?: () => void
    onEventCreated?: (eventId?: string) => void
}

export default function FieldsPerformance(props: FieldsPerformancePros) {
    const { hide, show } = useShowAlerts()
    const { urlParameters } = useUrlParams()
    const { programStage, schoolName } = urlParameters
    const { dataElements, value, program, originalData, rowDisabled, onEventCreating, onEventCreated } = props;
    const [values, setValues] = useState({ ...value })

    const { uploadValues } = useUploadEvents()
    const { saveMarks, error, loading, success, setError } = useSaveMarks()

    const memoizedValues = useMemo(() => values, [JSON.stringify(values)]);
    const memoizedDataElements = useMemo(() => [dataElements], [JSON.stringify(dataElements)]);

    const { runRulesEngine, updatedVariables } = RulesEngine({
        values: memoizedValues, program: program, type: "programStage", variables: memoizedDataElements as any,
        context: { event: { programStage, orgUnit: value.orgUnitId, event: value.programStageEvent } },
    })

    const [newMark, setNewMark] = useState(updatedVariables[0].value)

    function showAlert(message: string, type: any) {
        show({ message: message, type: type });
        setTimeout(hide, 5000);
    }

    useEffect(() => {
        runRulesEngine({ overrideValues: memoizedValues, overrideVariables: memoizedDataElements as any })
    }, [value, newMark])

    const handleChange = (e: any) => {
        const newValue = e?.target?.value ?? e
        setNewMark(newValue)

        // Update the values in the state
        setValues((prevValues) => ({
            ...prevValues,
            [dataElements.id]: newValue
        }))

        runRulesEngine({ overrideValues: memoizedValues, overrideVariables: memoizedDataElements as any })
    }

    const handleBlur = async () => {
        if (!value?.programStageEvent) {
            // Ainda não existe evento para esta TEI: avisa o includeFields para desabilitar a linha enquanto cria
            onEventCreating?.()

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
                .then((resp: any) => {
                    // Pega o id do evento criado na resposta
                    const createdEventId = resp?.bundleReport?.typeReportMap?.event?.objectReports?.[0]?.uid
                        ?? resp?.bundleReport?.typeReportMap?.EVENT?.objectReports?.[0]?.uid

                    if (createdEventId) {
                        // Sobe o id do evento para a linha da TEI (via includeFields),
                        // para que as próximas células salvem apenas dataValues
                        value.programStageEvent = createdEventId
                        if (originalData) originalData.programStageEvent = createdEventId
                    }

                    onEventCreated?.(createdEventId)

                    if (resp?.stats?.ignored > 0) {
                        // Falha ao criar o evento: mostra o alerta sem fazer reload e esconde-o ao fim de 3 segundos
                        setNewMark(null)
                        setError(true)
                        showAlert(`Could not create the event: ${resp?.validationReport?.errorReports?.[0]?.message || ""}`, { critical: true })
                    }
                })

                .catch((err: any) => {
                    // Falha ao criar o evento: liberta a linha, mostra o alerta sem reload e esconde-o ao fim de 3 segundos
                    onEventCreated?.()
                    setNewMark(null)
                    setError(true)
                    showAlert(`Could not create the event: ${err?.details?.message || ""}`, { critical: true })

                })
        } else {
            const marks = {
                events: [{
                    dataValues: [{
                        value: newMark,
                        dataElement: dataElements?.id,
                    }],
                    orgUnit: value?.orgUnitId,
                    program: value?.programId,
                    programStage: programStage!,
                    enrollment: value?.enrollmentId,
                    event: value?.programStageEvent,
                    trackedEntity: value?.trackedEntity,
                    occurredAt: value?.registrationEventOccurredAt,
                }]
            }

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
        <>
            {
                performanceFieldsMapping({
                    visible: updatedVariables[0]?.visible,
                    loading: loading,
                    error: updatedVariables[0]?.error || error,
                    success: success,
                    warning: updatedVariables[0]?.warning,
                    disabled: updatedVariables[0]?.disabled || rowDisabled,
                    value: newMark,
                    handleBlur: handleBlur,
                    handleChange: handleChange,
                    field: updatedVariables[0],
                    content: updatedVariables[0]?.content || "",
                    fieldType: updatedVariables[0]?.valueType,
                    options: updatedVariables[0]?.options?.optionSet?.options
                })
            }
        </>
    )
}
