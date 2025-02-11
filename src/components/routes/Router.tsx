import React from 'react';
import { Routes, Route, HashRouter} from 'react-router-dom';
import { FinalResult } from '../../pages';
import { FullLayout } from '../../layout';

export default function Router() {
    console.log("Router")
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<FullLayout />}>
                    <Route key={'enrollments'} path={'/'} element={<FinalResult />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
