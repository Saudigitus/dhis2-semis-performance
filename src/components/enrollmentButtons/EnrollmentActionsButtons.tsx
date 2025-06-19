import React, { useState } from 'react'
import { Form } from 'react-final-form';
import ShowStats from '../stats/showStats';
import { Tooltip } from '@mui/material';
import { useConfig } from '@dhis2/app-runtime';
import styles from './enrollmentActionsButtons.module.css'
import { Button, ButtonStrip, IconUserGroup16, IconEdit24 } from "@dhis2/ui";
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { useGetSectionTypeLabel, useShowAlerts, useUrlParams } from 'dhis2-semis-functions';
import { DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import EditOffIcon from '@mui/icons-material/EditOff';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey, setEditionMode, editionMode }: { programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey, setEditionMode: (editionMode: boolean) => void, editionMode: boolean }) {
    const { baseUrl } = useConfig()
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, class: section, grade, academicYear } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [stats, setStats] = useState<{ posted: number, conflicts: any[] }>({ posted: 0, conflicts: [] })
    const [open, setOpen] = useState<boolean>(false)
    const { hide, show } = useShowAlerts()

    const showAlert = (error: any) => {
        show({ message: `Unknown error: ${error}`, type: { critical: true } })
        setTimeout(hide, 5000);
    }

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL={baseUrl}
                label={'Bulk Performance'}
                module='performance'
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                updating={false}
                title={"Bulk Performance"}

            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL={baseUrl}
                eventFilters={[
                    ...(academicYear ? [`${selectedDataStoreKey.registration.academicYear}:in:${academicYear}`] : []),
                    ...(grade ? [`${selectedDataStoreKey.registration.grade}:in:${grade}`] : []),
                    ...(section ? [`${selectedDataStoreKey.registration.section}:in:${section}`] : []),
                ]}
                label='Export students performace'
                module='performance'
                onError={(e: any) => { showAlert(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                stagesToExport={selectedDataStoreKey.performance?.programStages.map(x => x.programStage)!}
            />,
            divider: false,
            disabled: false,
        },
    ];

    return (
        <div className={styles.container}>
            <ShowStats open={open} setOpen={setOpen} stats={stats} />
            <ButtonStrip className={styles.work_buttons}>

                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <Button
                        onClick={() => setEditionMode(!editionMode)}
                        icon={editionMode ? <EditOffIcon /> : <IconEdit24 />}
                    >
                        <span>{editionMode ? "Disable Edition Mode" : "Allow Edit Mode"}</span>
                    </Button >
                </Tooltip>

                <Tooltip title={(section === null || grade === null || academicYear == undefined) ? "Please select section and grade" : ""} >
                    <span>
                        <DropdownButton
                            name={<span className={styles.work_buttons_text}>Bulk Performance</span> as unknown as string}
                            disabled={!!(orgUnit == undefined || section == undefined || grade == undefined || academicYear == undefined)}
                            icon={<IconUserGroup16 />}
                            options={enrollmentOptions}
                        />
                    </span>
                </Tooltip>

            </ButtonStrip>
        </div>
    )
}

export default EnrollmentActionsButtons