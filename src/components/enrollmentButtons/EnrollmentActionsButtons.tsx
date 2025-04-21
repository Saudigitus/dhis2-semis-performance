import React, { useState } from 'react'
import { ButtonStrip, IconUserGroup16 } from "@dhis2/ui";
import styles from './enrollmentActionsButtons.module.css'
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import ShowStats from '../stats/showStats';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey }: { programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit, class: section, grade, academicYear } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [stats, setStats] = useState<{ posted: number, conflicts: any[] }>({ posted: 0, conflicts: [] })
    const [open, setOpen] = useState<boolean>(false)

    const enrollmentOptions: any = [
        {
            label: <DataImporter
                baseURL='http://localhost:8080'
                importMode='COMMIT'
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
            label: <span className='ms-1'>Bulk Edition</span>,
            divider: true,
            disabled: false,
        }
    ];

    return (
        <div className={styles.container}>
            <ShowStats open={open} setOpen={setOpen} stats={stats} />
            <ButtonStrip className={styles.work_buttons}>

                <DropdownButton
                    name={<span className={styles.work_buttons_text}>Bulk Actions</span> as unknown as string}
                    disabled={!!(orgUnit == undefined || section == undefined || grade == undefined || academicYear == undefined)}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>
        </div>
    )
}

export default EnrollmentActionsButtons
