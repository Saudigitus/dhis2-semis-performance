import { useState } from "react";
import { useDataEngine } from "@dhis2/app-runtime"
import { useShowAlerts } from "dhis2-semis-functions";

const POST_DATA_VALUE: any = {
    type: 'update',
    resource: "events",
    id: ({ id }: any) => id,
    data: ({ data }: any) => data
}

type saveMarksType = {
    id: string
    data: object
}

export default function useSaveMarks() {
    const engine = useDataEngine()
    const { hide, show } = useShowAlerts()
    const [data, setData] = useState<boolean>(false)
    const [error, setError] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const saveMarks = async ({ id, data }: saveMarksType) => {
        return await engine.mutate(POST_DATA_VALUE, {
            variables: { id, data },
            onComplete: (() => { }),
            onError: ((error) => {
                show({
                    message: `Could not save the marks: ${error.details.message}`,
                    type: { critical: true }
                });
                setTimeout(hide, 5000);
            })
        })
    }

    return { loading, saveMarks, saved: data, error }
}