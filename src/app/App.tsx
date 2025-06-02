import React from 'react'
import './App.module.css'
import { Router } from '../components/routes'
// import InitializeWrapper from '../wrapper/InitializeWrapper'

const Performance = () => {

    if (import.meta.env.MODE === 'production') {
        return <Router />
    }

    return (
        // <InitializeWrapper>
            <Router />
        // </InitializeWrapper>
    )
}

export default Performance