import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import InitializeWrapper from '../wrapper/InitializeWrapper'
import { AppWrapper } from 'dhis2-semis-components'
import { useConfig } from '@dhis2/app-runtime'
import { HashRouter } from 'react-router-dom'
import { D2I18n } from 'dhis2-semis-types'
import translation from '../locales'

const Performance = ({ i18n, baseUrl }: { i18n: D2I18n; baseUrl?: string }) => {
    const { baseUrl: localBaseUrl } = useConfig()
    const translate: any = i18n ? i18n : translation
    const useBaseUrl = baseUrl || localBaseUrl

    return (
        // <AppWrapper i18n={translate} baseUrl={useBaseUrl} dataStoreKey='dataStore/semis/values' schoolCalendarKey='dataStore/semis/schoolCalendar'>
        //     <InitializeWrapper>
        //         <HashRouter>
                    <Router i18n={translate} baseUrl={useBaseUrl} />
        //         </HashRouter>
        //     </InitializeWrapper>
        // </AppWrapper>
    )
}

export default Performance
