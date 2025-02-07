import React from 'react';
import { RouteList } from '.';
import { Routes, Route } from 'react-router-dom';

export default function Router() {
    return (
        <Routes>
            {
                RouteList().map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={
                            <route.layout>
                                {route.component()}
                            </route.layout>
                        }
                    />
                ))
            }
        </Routes>
    )
}
