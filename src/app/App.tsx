import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import InitializeWrapper from '../wrapper/InitializeWrapper'
import { AppWrapper } from 'dhis2-semis-components'
import { HashRouter } from 'react-router-dom'

const Performance = () => {
    return (
        <AppWrapper dataStoreKey='dataStore/semis/values' >
            <InitializeWrapper>
               <HashRouter>
                 <Router />
               </HashRouter>
            </InitializeWrapper>
        </AppWrapper>
    )
}

export default Performance