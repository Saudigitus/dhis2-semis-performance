import { InfoPage, Table } from "dhis2-semis-components";
import React from "react";
import { headerColumns, rowsData } from "../../utils/constants/table/tableConstants";
import { RowActionsType } from "dhis2-semis-components/dist/declarations/types/table/TableRowActionsProps";
import { IconCheckmarkCircle24, IconDelete24, IconEdit24 } from "@dhis2/ui";

export default function EnrollmentsPage() {
    
    const rowsActions: RowActionsType[] = [
        { icon: <IconEdit24 />, color: '#277314', label: `Edition`, disabled: true, loading: false, onClick: () => { alert("Edition") } },
        { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: () => { alert("Delete") } },
        { icon: <IconCheckmarkCircle24 />, color: '#147cd7', disabled: false, loading: false, label: 'Complete', onClick: () => { alert("Complete") } }
    ];

    return (
        <div style={{ height: "80vh" }} >
            <Table
                viewPortWidth={1040}
                columns={headerColumns}
                totalElements={4}
                loading={false}
                createSortHandler={() => { }}
                order={"asc"}
                orderBy={"fistid1"}
                tableData={rowsData}
                sortable={true}
                isInactive={false}
                isOwnershipOu={false}
                showEnrollments={false}
                showRowActions={true}
                rowAction={rowsActions}
                defaultFilterNumber={3}
                filterState={{ attributes: [], dataElements: [] }}
                setFilterState={() => { }}
            />
        </div>
    )
}