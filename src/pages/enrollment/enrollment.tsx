import { InfoPage, Table } from "dhis2-semis-components";
import React from "react";
import { headerColumns, rowsActions, rowsData } from "../../utils/constants/table/tableConstants";

export default function EnrollmentsPage() {

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