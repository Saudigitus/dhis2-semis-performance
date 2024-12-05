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
