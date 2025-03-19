import { useBuildForm, useUrlParams } from "dhis2-semis-functions";
import { useState } from "react";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import { Modules } from 'dhis2-semis-types';
import { useDataStoreKey, WithBorder, useProgramsKeys, CustomForm, ModalComponent, WithPadding } from "dhis2-semis-components";
import { Form } from "react-final-form";
import { staticForm } from "../../constants/searchEnrollmentForm";
import { format } from "date-fns";
import { usePromoteStudents } from "../../hooks/promote/usePromoteStudents";

export default function PerformPromotion({ selected, setStats, openStats }: { openStats: (args: boolean) => void, setStats: any, selected: any[] }) {
    const programsValues = useProgramsKeys();
    const { urlParameters } = useUrlParams()
    const { schoolName } = urlParameters()
    const programData = programsValues[0];
    const dataStoreData = useDataStoreKey({ sectionType: "student" });
    const { formData } = useBuildForm({ dataStoreData, programData, module: Modules.Enrollment });
    const [enrollmentDetails = []] = formData;
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { promote } = usePromoteStudents({ selected, setOpen: openStats, setStats, setOpenPerform: setOpen, setLoading })

    const onClick = async (values: any) => await promote(values)

    return (
        <>
            <Button onClick={() => {
                setOpen(true);
            }} icon={<IconAddCircle24 />}
            >
                <span>Perform promotion</span>
            </Button >

            {
                open && <ModalComponent
                    children={<WithPadding>
                        <NoticeBox title={`WARNING! ${selected.length} rows will be affected`} warning>
                            No one will be able to access this program. Add some Organisation Units to the access list.
                        </NoticeBox>
                        <WithBorder type="all" >
                            <WithPadding>
                                <CustomForm
                                    Form={Form}
                                    loading={loading}
                                    initialValues={{ registeringSchool: schoolName, enrollment_date: format(new Date(), 'yyyy-MM-dd') }}
                                    formFields={[
                                        {
                                            storyBook: false,
                                            name: "Student promotion",
                                            description: "Student promotion",
                                            fields: [
                                                staticForm().registeringSchool,
                                                ...enrollmentDetails,
                                                staticForm().enrollmentDate
                                            ]
                                        }
                                    ]}
                                    storyBook={false}
                                    withButtons={true}
                                    onFormSubtmit={(values) => onClick(values)}
                                    onCancel={() => setOpen(false)}
                                />
                            </WithPadding>
                        </WithBorder>
                    </WithPadding>}
                    open={open}
                    handleClose={() => setOpen(false)}
                    title="Perform Promotion"
                />
            }
        </>
    );
}