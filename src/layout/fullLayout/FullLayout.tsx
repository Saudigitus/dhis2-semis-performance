import React from 'react'
import style from "../Layout.module.css"
import { MainHeader, SideBar } from 'dhis2-semis-components';
import { sideBarData } from '../../utils/constants/sideBar/sideBarData';
import { filterItem } from '../../types/dataStore/DataStoreConfig';
import { LayoutProps } from '../../types/layout/LayoutProps';
import { useLocation } from 'react-router-dom';
import header from '../../utils/constants/header/header.json'

export default function FullLayout(props: LayoutProps) {
    const { children } = props;
    const location = useLocation()

    console.log(sideBarData(location.search, [] as unknown as filterItem[]))
    return (
        <div className={style.LayoutContainer}>
            <SideBar sideBarData={sideBarData(location.search, [] as unknown as filterItem[])} />
            <div className={style.FullLayoutContainer}>
                <div>
                    <MainHeader headerItems={header} height='50px' />
                </div>
                <main className={style.MainContentContainer}>
                    {children}
                </main>
            </div>
        </div>
    )
}

[
    {
        "title": "Navigation",
        "displayInMenu": true,
        "subItems": [
            {
                "icon": "/src/assets/images/sidebar/home.svg",
                "displayInMenu": true,
                "label": "Home",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS",
                "route": "home",
                "appUrl": "/home",
                "active": true
            }
        ]
    },
    {
        "title": "Students",
        "displayInMenu": true,
        "subItems": [
            {
                "icon": "/src/assets/images/sidebar/listAdd.svg",
                "displayInMenu": true,
                "label": "Enrollment",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Enrollment",
                "route": "enrollment?",
                "appUrl": "/enrollment/student",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/Glyph.svg",
                "displayInMenu": true,
                "label": "Attendance",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Attendance",
                "route": "attendance?",
                "appUrl": "/attendance/student",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/file-document.svg",
                "displayInMenu": true,
                "label": "Performance",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Performance",
                "route": "performance?",
                "appUrl": "/performance/student",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/gauge.svg",
                "displayInMenu": true,
                "label": "Final result",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Final-Result",
                "route": "final-result?",
                "appUrl": "/final-result/student",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/log-out.svg",
                "displayInMenu": true,
                "label": "Transfer",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Transfer",
                "route": "transfer",
                "appUrl": "/transfer/student",
                "active": false
            }
        ]
    },
    {
        "title": "Staff",
        "displayInMenu": true,
        "subItems": [
            {
                "icon": "/src/assets/images/sidebar/user-group.svg",
                "displayInMenu": true,
                "label": "Staff registry",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Enrollment",
                "route": "enrollment",
                "appUrl": "/enrollment/staff",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/Glyph.svg",
                "displayInMenu": true,
                "label": "Attendance",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Attendance",
                "route": "attendance",
                "appUrl": "/attendance/staff",
                "active": false
            },
            {
                "icon": "/src/assets/images/sidebar/log-out.svg",
                "displayInMenu": true,
                "label": "Transfer",
                "showBadge": false,
                "disabled": false,
                "appName": "SEMIS-Transfer",
                "route": "transfer",
                "appUrl": "/transfer/staff",
                "active": false
            }
        ]
    }
]