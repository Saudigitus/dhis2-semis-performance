import React from 'react';
import { FinalResult } from '../../pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import WithHeaderBarLayout from '../../layout/WithHeaderBarLayout';

export default function Router() {
    return (
        <HashRouter>
            <Routes>
                <Route path='/' element={<WithHeaderBarLayout />}>
                    <Route key={'performance'} path={'/'} element={<FinalResult />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
