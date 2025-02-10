import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { EnrollmentsPage } from '../../pages';
import { FullLayout } from '../../layout';

export default function Router() {
    return (
        <Routes>
            <Route path='/semis' element={<FullLayout />}>
                <Route key={'enrollments'} path={'enrollment'} element={<EnrollmentsPage />} />
            </Route>
        </Routes>
    );
}
