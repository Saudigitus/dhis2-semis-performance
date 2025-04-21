import { useRecoilValue } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { InfoPage, SwitchButtonView, useDataStoreKey } from 'dhis2-semis-components'
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";

interface ProgramStage {
  id: string;
  displayName: string;
}

interface FilteredStage {
  id: string;
  label: string;
}

export default function Performance() {
  const { sectionName } = useGetSectionTypeLabel();
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters, add } = useUrlParams();
  const [selected, setSelected] = useState<{ id: any, label: string }>({ id: "", label: "" });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })
  const { academicYear, grade, class: section, schoolName, school } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Performance, selectedDataStore: dataStoreData });
  const [filterState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const refetch = useRecoilValue(TableDataRefetch);
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: selected?.id });

  useEffect(() => {
    void getData({
      page: pagination.page,
      pageSize: pagination.pageSize,
      program: programData.id as string,
      orgUnit: school!,
      baseProgramStage: dataStoreData?.registration?.programStage as string,
      attributeFilters: filterState.attributes,
      dataElementFilters: filterState.dataElements,
      otherProgramStage: selected?.id
    })
  }, [filterState, refetch, pagination.page, pagination.pageSize, selected?.id])

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

  function filterProgramStages(programData: any, filterData: any): FilteredStage[] {
    return programData.programStages
      .filter((stage: ProgramStage) =>
        filterData.programStages.some((filterStage: { programStage: string }) => filterStage.programStage === stage.id)
      )
      .map((stage: ProgramStage) => ({
        id: stage.id,
        label: stage.displayName
      }));
  }

  function addProgramStageToUrl(value: any) {
    console.log(value)
    add("programStage", value.id)
  }

  console.log(columns)

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
              rightElements={<EnrollmentActionsButtons selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
              setFilterState={setFilterState}
              pagination={pagination}
              setPagination={setPagination}
              paginate={!loading}
              beforeSettings={<SwitchButtonView items={filterProgramStages(programData, dataStoreData.performance)} onSelect={addProgramStageToUrl} selected={selected} setSelected={setSelected} />}
            />
          </>
      }
    </div>
  )
}
