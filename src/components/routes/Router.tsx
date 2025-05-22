import React from 'react';
import { Performance } from '../../pages';
import { Routes, Route } from 'react-router-dom';
import WithHeaderBarLayout from '../../layout/WithHeaderBarLayout';

export default function Router() {
    return (
        <Routes>
            <Route path='/' element={<WithHeaderBarLayout />}>
                <Route key={'performance'} path={'/'} element={<Performance />} />
            </Route>
        </Routes>
    );
}
