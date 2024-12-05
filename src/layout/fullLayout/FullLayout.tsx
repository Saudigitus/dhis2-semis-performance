import React from 'react'
import style from "../Layout.module.css"
import { MainHeader } from 'dhis2-semis-components';
import { LayoutProps } from '../../types/layout/LayoutProps';
import header from '../../utils/constants/header/header.json'

export default function FullLayout(props: LayoutProps) {
    const { children } = props;

    return (
        <div className={style.LayoutContainer}>
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

