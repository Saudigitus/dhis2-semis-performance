import { useRecoilValue } from 'recoil';
import { ProgramConfig } from 'dhis2-semis-types'
import React, { useEffect, useState } from "react";
import { TableDataRefetch, Modules } from "dhis2-semis-types"
import { InfoPage, SwitchButtonView, useDataStoreKey } from 'dhis2-semis-components'
import { Table, useProgramsKeys } from "dhis2-semis-components";
import EnrollmentActionsButtons from "../../components/enrollmentButtons/EnrollmentActionsButtons";
import { RulesEngine, useGetSectionTypeLabel, useHeader, useTableData, useUrlParams, useViewPortWidth } from "dhis2-semis-functions";
import { changeDataElementType, includeFields } from '../../utils/fields/includeFields';

interface ProgramStage {
  id: string;
  displayName: string;
}

interface FilteredStage {
  id: string;
  label: string;
}

export default function Performance() {
  const programsValues = useProgramsKeys();
  const programData = programsValues[0];
  const { viewPortWidth } = useViewPortWidth();
  const { urlParameters, add } = useUrlParams();
  const refetch = useRecoilValue(TableDataRefetch);
  const { sectionName } = useGetSectionTypeLabel();
  const [editionMode, setEditionMode] = useState(false)
  const dataStoreData = useDataStoreKey({ sectionType: sectionName });
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, totalPages: 0 })
  const [selected, setSelected] = useState<{ id: any, label: string }>({ id: "", label: "" });
  const { academicYear, grade, class: section, schoolName, school, programStage } = urlParameters();
  const { getData, tableData, loading } = useTableData({ module: Modules.Performance });
  const [filterState, setFilterState] = useState<{ dataElements: any[], attributes: any[] }>({ attributes: [], dataElements: [] });
  const { columns } = useHeader({ dataStoreData, programConfigData: programData as unknown as ProgramConfig, tableColumns: [], programStage: programStage! });

  const { runRulesEngine, updatedVariables } = RulesEngine({
    variables: columns as any,
    values: { [dataStoreData.registration.grade]: grade },
    type: "programStage",
    program: programData.id as string
  })

  const termSelected = programData?.programStages?.find((stage) => stage.id === programStage)

  const filters = [
    grade && `${dataStoreData.registration.grade}:in:${grade}`,
    section && `${dataStoreData.registration.section}:in:${section}`,
    academicYear && `${dataStoreData.registration.academicYear}:in:${academicYear}`,
  ] as string[];

  useEffect(() => {
    runRulesEngine()
    void getData({
      orgUnit: school!,
      page: pagination.page,
      pageSize: pagination.pageSize,
      otherProgramStage: programStage!,
      program: programData.id as string,
      attributeFilters: filterState.attributes,
      dataElementFilters: [...filterState.dataElements, ...filters],
      baseProgramStage: dataStoreData?.registration?.programStage as string,
    })

  }, [filterState, refetch, pagination.page, pagination.pageSize, programStage, school, section, grade, academicYear])

  useEffect(() => {
    setPagination((prev: any) => ({ ...prev, totalPages: tableData.pagination.totalPages }))
  }, [tableData])

  useEffect(() => {
    setSelected({ id: programStage, label: "" })
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
    add("programStage", value.id)
  }

  const dataElementIds: any = termSelected?.programStageDataElements.map(
    (item) => item.dataElement.id
  );

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
              columns={changeDataElementType({ headerRows: updatedVariables as unknown as any, dataElementIds })}
              tableData={includeFields({ rowsData: tableData.data, headerRows: changeDataElementType({ headerRows: updatedVariables as unknown as any, dataElementIds }), mode: editionMode, dataElementIds, program: programData.id })}
              defaultFilterNumber={3}
              filterState={filterState}
              loading={loading}
              rightElements={<EnrollmentActionsButtons setEditionMode={setEditionMode} editionMode={editionMode} selectedDataStoreKey={dataStoreData} programData={programData as unknown as ProgramConfig} />}
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
