import React, { useState } from 'react'
import { Button, ButtonStrip, IconAddCircle24, IconUserGroup16 } from "@dhis2/ui";
import styles from './enrollmentActionsButtons.module.css'
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import ShowStats from '../stats/showStats';
import { Tooltip } from '@material-ui/core';
import { Form } from 'react-final-form';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey, setEditionMode, editionMode }: { programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey, setEditionMode: (editionMode: boolean) => void, editionMode: boolean }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, class: section, grade, academicYear, schoolName } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [stats, setStats] = useState<{ posted: number, conflicts: any[] }>({ posted: 0, conflicts: [] })
    const [open, setOpen] = useState<boolean>(false)

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL='http://localhost:8080'
                label={'Bulk Performance'}
                module='performance'
                onError={(e: any) => { console.log(e) }}
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
                baseURL='http://localhost:8080'
                eventFilters={[
                    ...(academicYear ? [`${selectedDataStoreKey.registration.academicYear}:in:${academicYear}`] : []),
                    ...(grade ? [`${selectedDataStoreKey.registration.grade}:in:${grade}`] : []),
                    ...(section ? [`${selectedDataStoreKey.registration.section}:in:${section}`] : []),
                ]}
                fileName={`${schoolName}-${grade}-${section}-Performance`}
                label='Export students performace'
                module='performance'
                onError={(e: any) => console.log(e)}
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
                    <Button onClick={() => setEditionMode(!editionMode)}
                    >
                        <span>{editionMode ? "Disable Edition Mode" : "Allow Edition Mode"}</span>
                    </Button >
                </Tooltip>

                <DropdownButton
                    name={<span className={styles.work_buttons_text}>Bulk Performance</span> as unknown as string}
                    disabled={!!(orgUnit == undefined || section == undefined || grade == undefined || academicYear == undefined)}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>
        </div>
    )
}

export default EnrollmentActionsButtons
