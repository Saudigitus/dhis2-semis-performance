import { useGetEvents, useGetSectionTypeLabel, useUploadEvents, useUrlParams } from "dhis2-semis-functions"
import { useDataStoreKey, useProgramsKeys } from "dhis2-semis-components";
import { TableDataRefetch } from "dhis2-semis-types";
import { useSetRecoilState } from "recoil";
import { format } from "date-fns";

export function usePromoteStudents({ selected }: { selected: any[] }) {
    const { getEvents } = useGetEvents()
    const { sectionName } = useGetSectionTypeLabel();
    const dataStoreData = useDataStoreKey({ sectionType: sectionName });
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const programsValues = useProgramsKeys();
    const programData = programsValues[0];
    const { uploadValues } = useUploadEvents()
    const setRefetch = useSetRecoilState(TableDataRefetch);

    async function promote(values: any) {
        let registration: any = []
        const scPstage = dataStoreData["socio-economics"].programStage
        let enrollments: any = []
        let date = format(new Date(), 'yyyy-MM-dd')

        Object.keys(dataStoreData.registration).forEach((ds: any) => {
            if (values?.[(dataStoreData?.registration as unknown as any)?.[ds]]) {
                registration.push({
                    dataElement: (dataStoreData?.registration as unknown as any)?.[ds],
                    value: values?.[(dataStoreData?.registration as unknown as any)?.[ds]]
                })
            }
        })

        const getEventStructure = (stage: string, datavalues: any[]) => {
            return { occurredAt: date, notes: [], status: "ACTIVE", program: programData.id, programStage: stage, orgUnit, scheduledAt: date, dataValues: datavalues }
        }

        for (const tei of selected) {
            let events = []
            let socioEconomicDataValues: any = []

            const scData = await getEvents({ program: tei.programId, fields: "*", trackedEntity: tei.trackedEntity, programStage: scPstage })
            const event = scData?.find((x: any) => x.enrollment === tei.enrollmentId)

            if (event) {
                event?.dataValues.forEach((dataValue: any) => {
                    socioEconomicDataValues.push({
                        dataElement: dataValue?.dataElement,
                        value: dataValue?.value
                    })
                })

                events.push(getEventStructure(scPstage, socioEconomicDataValues))
            }

            events.push(getEventStructure(dataStoreData.registration.programStage, registration))

            dataStoreData.performance?.programStages.forEach(performanceProgramStage => {
                events.push(getEventStructure(performanceProgramStage.programStage, []))
            })

            enrollments.push(
                {
                    enrollments: [
                        {
                            occurredAt: date,
                            enrolledAt: values.enrollment_date,
                            program: programData.id,
                            orgUnit,
                            status: "COMPLETED",
                            events: events
                        }
                    ],
                    orgUnit,
                    trackedEntityType: dataStoreData.trackedEntityType,
                    trackedEntity: tei.trackedEntity
                })
        }

        await uploadValues({ trackedEntities: enrollments }, 'COMMIT', 'CREATE_AND_UPDATE').then((resp) => {
            setRefetch(prevValue => (!prevValue))
        })
    }

    return { promote }
}