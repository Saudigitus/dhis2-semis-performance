import { useProgramsKeys  } from 'dhis2-semis-components'
import { RulesEngineWrapper } from 'dhis2-semis-functions'
import React from 'react'

function InitializeWrapper({ children }: { children: React.ReactNode }) {
const programs = useProgramsKeys()
  return (
    <RulesEngineWrapper programs={[programs[0].id, programs[1].id]}>
      {children}
    </RulesEngineWrapper>
  )
}

export default InitializeWrapper