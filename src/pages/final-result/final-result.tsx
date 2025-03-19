import { useRecoilState, useRecoilValue } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { IconDelete24 } from "@dhis2/ui";
import { InfoPage, useDataStoreKey } from 'dhis2-semis-components'
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";

export default function FinalResult() {
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters } = useUrlParams();
  const [selected, setSelected] = useState([])
  const { academicYear, grade, class: section, schoolName, school } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Final_Result, selectedDataStore: dataStoreData });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], module: Modules.Final_Result });
  const [filetrState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const refetch = useRecoilValue(TableDataRefetch);

  const rowsActions = [
    { icon: <IconDelete24 />, color: '#d64d4d', label: `Delete`, disabled: false, loading: false, onClick: (e: any) => { console.log(e) } },
  ];

  useEffect(() => {
    void getData({ page: 1, pageSize: 10, program: programData.id as string, orgUnit: "Shc3qNhrPAz", baseProgramStage: dataStoreData?.registration?.programStage as string, attributeFilters: filetrState.attributes, dataElementFilters: [`${dataStoreData?.registration?.academicYear}:in:2023`] })
  }, [filetrState, refetch])

  useEffect(() => {
    const filters = [
      `${dataStoreData.registration.academicYear}:in:${academicYear}`,
      `${dataStoreData.registration.grade}:in:${grade}`,
      `${dataStoreData.registration.section}:in:${section}`,
    ]
    setFilterState({ dataElements: filters, attributes: [] })
  }, [academicYear, grade, section])


  return (
    <div style={{ height: "85vh" }}>
      {
        !(Boolean(schoolName) && Boolean(school)) ?
          <InfoPage
            title="SEMIS-Final-Result"
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
              title="Final Results"
              viewPortWidth={viewPortWidth}
              columns={columns}
              totalElements={4}
              tableData={tableData}
              rowAction={rowsActions}
              defaultFilterNumber={3}
              showRowActions
              filterState={filetrState}
              loading={loading}
              rightElements={<EnrollmentActionsButtons selected={selected} filetrState={filetrState} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
              setFilterState={setFilterState}
              selectable={true}
              selected={selected}
              setSelected={setSelected}
            />
          </>
      }
    </div>
  )
}