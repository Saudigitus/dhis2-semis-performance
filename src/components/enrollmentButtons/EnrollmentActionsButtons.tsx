import React, { useState } from 'react'
import {
    IconAddCircle24,
    Button,
    ButtonStrip,
    IconUserGroup16,
    IconSearch24,
} from "@dhis2/ui";
import Tooltip from '@material-ui/core/Tooltip';
import { FlyoutOptionsProps } from "../../types/buttons/FlyoutOptionsProps";
import styles from './enrollmentActionsButtons.module.css'

import DropdownButtonComponent from '../buttons/DropdownButton';
import { ModalComponent, useDataStoreKey } from 'dhis2-semis-components';
import { useGetSectionTypeLabel, useUrlParams } from 'dhis2-semis-functions';

function EnrollmentActionsButtons() {
    const { urlParameters } = useUrlParams();
    const { school: orgUnit } = urlParameters();
    const { sectionName } = useGetSectionTypeLabel();
    const [openSearchEnrollment, setOpenSearchEnrollment] = useState<boolean>(false);

    const enrollmentOptions: FlyoutOptionsProps[] = [
        {
            label: `Enroll new ${sectionName}s`,
            divider: true,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: `Update existing ${sectionName}s`,
            divider: true,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: "Export empty template",
            divider: false,
            disabled: false,
            onClick: () => { { } }
        },
        {
            label: "Export existing students",
            divider: false,
            disabled: false,
            onClick: async () => { { } }
        }
    ];

    return (
        <div className={styles.container}>
            <ButtonStrip className={styles.work_buttons}>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <span>
                        <Button onClick={() => {
                            setOpenSearchEnrollment(true);
                        }} icon={<IconSearch24 />}>
                            <span className={styles.work_buttons_text}>Search {sectionName?.toLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>
                <Tooltip title={orgUnit === null ? "Please select an organisation unit before" : ""}>
                    <span>
                        <Button icon={<IconAddCircle24 />}>
                            <span className={styles.work_buttons_text}>Enroll {sectionName.toLocaleLowerCase()}</span>
                        </Button>
                    </span>
                </Tooltip>
                <DropdownButtonComponent
                    name={<span className={styles.work_buttons_text}>Bulk enrollment</span> as unknown as string}
                    disabled={false}
                    icon={<IconUserGroup16 />}
                    options={enrollmentOptions}
                />
            </ButtonStrip>

            {openSearchEnrollment &&
                <ModalComponent title={`Search for enrolled ${sectionName.toLowerCase()}`} open={openSearchEnrollment}
                    handleClose={() => setOpenSearchEnrollment(false)}>
                    Search for enrolled {sectionName.toLowerCase()}
                </ModalComponent>}
        </div>
    )
}

export default EnrollmentActionsButtons
