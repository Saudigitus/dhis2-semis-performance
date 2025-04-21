import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { FinalResult } from '../../pages';
import { FullLayout } from '../../layout';

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<FullLayout />}>
                    <Route key={'performance'} path={'/'} element={<FinalResult />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
