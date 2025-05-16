import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import InitializeWrapper from '../wrapper/InitializeWrapper'

const Performance = () => {
    return (
        <AppWrapper dataStoreKey='dataStore/semis/values'>
            <InitializeWrapper>
                <Router />
            </InitializeWrapper>
        </AppWrapper>
    )
}

export default Performance