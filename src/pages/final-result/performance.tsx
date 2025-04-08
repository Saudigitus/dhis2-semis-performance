import { useRecoilValue } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { IconDelete24 } from "@dhis2/ui";
import { InfoPage, useDataStoreKey } from 'dhis2-semis-components'
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";

export default function Performance() {
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters } = useUrlParams();
  const [selected, setSelected] = useState([])
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })
  const { academicYear, grade, class: section, schoolName, school } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Performance, selectedDataStore: dataStoreData });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: Modules.Performance });
  const [filterState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const refetch = useRecoilValue(TableDataRefetch);

  useEffect(() => {
    setSelected([])
    void getData({
      page: pagination.page,
      pageSize: pagination.pageSize,
      program: programData.id as string,
      orgUnit: school!,
      baseProgramStage: dataStoreData?.registration?.programStage as string,
      attributeFilters: filterState.attributes,
      dataElementFilters: filterState.dataElements
    })
  }, [filterState, refetch, pagination.page, pagination.pageSize])

  useEffect(() => {
    setPagination((prev) => ({ ...prev, totalPages: tableData.pagination.totalPages }))
  }, [tableData])

  useEffect(() => {
    const filters = [
      academicYear && `${dataStoreData.registration.academicYear}:in:${academicYear}`,
      grade && `${dataStoreData.registration.grade}:in:${grade}`,
      section && `${dataStoreData.registration.section}:in:${section}`,
    ]
    setFilterState({ dataElements: filters, attributes: [] })
  }, [academicYear, grade, section])


  return (
    <div style={{ height: "85vh" }}>
      {
        !(Boolean(schoolName) && Boolean(school)) ?
          <InfoPage
            title="SEMIS-Performance"
            sections={[
              {
                sectionTitle: "Follow the instructions to proceed:",
                instructions: [
                  "Select the Organization unit you want to view data",
                  "Use global filters(Class, Grade and Academic Year)"
                ]
              }
            ]}
          />
          :
          <>
            <Table
              programConfig={programData}
              title="Performance"
              viewPortWidth={viewPortWidth}
              columns={columns}
              tableData={tableData.data}
              defaultFilterNumber={3}
              filterState={filterState}
              loading={loading}
              rightElements={<EnrollmentActionsButtons selected={selected} filterState={filterState} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
              setFilterState={setFilterState}
              selectable={true}
              selected={selected}
              setSelected={setSelected}
              pagination={pagination}
              setPagination={setPagination}
              paginate={!loading}
            />
          </>
      }
    </div>
  )
}
