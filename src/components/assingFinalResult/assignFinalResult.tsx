import { useGetDataElements, useUrlParams,  } from "dhis2-semis-functions";
import { useState } from "react";
import { NoticeBox, Button, IconAddCircle24 } from "@dhis2/ui";
import { useDataStoreKey, WithBorder, ModalComponent, CustomForm, WithPadding } from "dhis2-semis-components";
import { Form } from "react-final-form";

export default function AsssignFinalResult({ selected }: { selected: any[]}) {
    const { urlParameters } = useUrlParams()
    const { sectionType } = urlParameters()
    const { "final-result": fr } = useDataStoreKey({ sectionType: sectionType as unknown as "student" | "staff" })
    const { dataElements } = useGetDataElements({ programStageId: fr?.programStage as unknown as string, type: "programStage" })
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { uploadValues } = {uploadValues:{}}

    async function formSubmit(values: any) {
        setLoading(true)
        let events = []
        let frStatus = Object.keys(values)[0]

        for (const tei of selected) {
            events.push({
                ...tei.frEvent,
                dataValues: [
                    {
                        dataElement: frStatus,
                        value: values[frStatus]
                    }
                ]
            })
        }
        // await uploadValues({ events: events }, 'COMMIT', 'CREATE_AND_UPDATE')
        //     .then(() => setLoading(false))
        //     .catch(() => setLoading(false))
    }


    return (
        <>
            <Button onClick={() => {
                setOpen(true);
            }} icon={<IconAddCircle24 />}
            >
                <span>Assing final result</span>
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
                                    formFields={[
                                        {
                                            storyBook: false,
                                            name: "Final Result",
                                            description: "Student final result",
                                            fields: dataElements
                                        }
                                    ]}
                                    storyBook={false}
                                    withButtons={true}
                                    onFormSubtmit={(e) => formSubmit(e)}
                                    onCancel={() => setOpen(false)}
                                />
                            </WithPadding>
                        </WithBorder>
                    </WithPadding>}
                    open={open}
                    handleClose={() => setOpen(false)}
                    title="Assign Final Result"
                />
            }
        </>
    );
}