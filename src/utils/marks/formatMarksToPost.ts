type formatMarksToSaveType = {
    event: {
        event: string,
        orgUnit: string,
        program:string,
        enrollment: string
        programStage: string
        trackedEntity: string
    }, dataElement: string, newMark: number
}

function formatMarksToSave(props: formatMarksToSaveType) {
    const { event, dataElement, newMark } = props;

    return {
        data: {
            dataValues: [{
                dataElement,
                value: newMark
            }],
            event: event?.event,
            // status: event?.status,
            orgUnit: event?.orgUnit,
            program: event?.program,
            enrollment: event?.enrollment,
            programStage: event?.programStage,
            trackedEntity: event?.trackedEntity,
        },
        id: `${event?.event}/${dataElement}`
    }
}

export { formatMarksToSave }