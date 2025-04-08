import React, { useState } from 'react'
import { ButtonStrip, IconUserGroup16 } from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import styles from './enrollmentActionsButtons.module.css'
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';
import { Form } from "react-final-form";
import { ProgramConfig, selectedDataStoreKey } from 'dhis2-semis-types'
import { DataExporter, DataImporter, CustomDropdown as DropdownButton } from 'dhis2-semis-components';
import AsssignFinalResult from '../assingFinalResult/assignFinalResult';
import PerformPromotion from '../perforPromotion/performPromotion';
import ShowStats from '../stats/showStats';

function EnrollmentActionsButtons({ programData, selectedDataStoreKey, filetrState, selected }: { selected: any, filetrState: any, programData: ProgramConfig, selectedDataStoreKey: selectedDataStoreKey }) {
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
                label={'Bulk Final Result'}
                module='final-result'
                onError={(e: any) => { console.log(e) }}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                updating={false}
                title={"Bulk Final Result"}
            />,
            divider: true,
            disabled: false,
        },
        {
            label: <DataExporter
                Form={Form}
                baseURL='http://localhost:8080'
                eventFilters={filetrState.dataElements}
                fileName='teste'
                label='Export Final Result'
                module='final-result'
                onError={(e: any) => console.log(e)}
                programConfig={programData}
                sectionType={sectionName}
                selectedSectionDataStore={selectedDataStoreKey}
                empty={false}
                stagesToExport={[selectedDataStoreKey?.['final-result']?.programStage as unknown as string]}
            />,
            divider: false,
            disabled: false,
        }
    ];

    return (
        <div className={styles.container}>
            <ShowStats open={open} setOpen={setOpen} stats={stats} />
            <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <AsssignFinalResult selected={selected} />
                </Tooltip>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""} >
                    <PerformPromotion openStats={setOpen} setStats={setStats} selected={selected} />
                </Tooltip>

                <DropdownButton
                    name={<span className={styles.work_buttons_text}>Bulk Final Result</span> as unknown as string}
                    disabled={!!(orgUnit == undefined || section == undefined || grade == undefined || academicYear == undefined)}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>
        </div>
    )
}

export default EnrollmentActionsButtons
