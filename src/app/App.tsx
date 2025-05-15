import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
import { AppWrapper } from 'dhis2-semis-components'
import InitializeWrapper from '../wrapper/InitializeWrapper'

const MyApp = () => {
    return (
        <AppWrapper dataStoreKey='semis/values'>
            <InitializeWrapper>
                <Router />
            </InitializeWrapper>
        </AppWrapper>
    )
}

export default MyApp
