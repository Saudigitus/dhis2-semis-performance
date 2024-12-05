import gauge from "../../../assets/images/sidebar/gauge.svg"
import fileDocument from "../../../assets/images/sidebar/file-document.svg"
import glyph from "../../../assets/images/sidebar/Glyph.svg"
import listAdd from "../../../assets/images/sidebar/listAdd.svg"
import logOut from "../../../assets/images/sidebar/log-out.svg"
import userGroup from "../../../assets/images/sidebar/user-group.svg"
import { type SideBarItemProps } from "../../../types/sideBar/SideBarTypes"
import { filterItem } from "../../../types/dataStore/DataStoreConfig"
import home from "../../../assets/images/sidebar/home.svg"
import { subItemRoute } from "./subItemRoute"
import { toggleButtonGroupClasses } from "@mui/material"


function sideBarData(locationParms: string, filterDataElements: filterItem[]): SideBarItemProps[] {

    return [
        {
            displayInMenu: true,
            title: "Navigation",
            subItems: [
                {
                    icon: home,
                    label: "Home",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS",
                    route: `home`,
                    displayInMenu: true,
                    active: true,
                    appUrl: "/home"
                }
            ]
        },
        {
            displayInMenu: true,
            title: "Student",
            subItems: [
                {
                    icon: listAdd,
                    label: "Enrollment",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment",
                    route: `enrollment?${subItemRoute(locationParms.slice(1), 'student', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/enrollment/student"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: `attendance?${subItemRoute(locationParms.slice(1), 'student', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/attendance/student"
                },
                {
                    icon: fileDocument,
                    label: "Performance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Performance",
                    route: `performance?${subItemRoute(locationParms.slice(1), 'student', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/performance/student"
                },
                {
                    icon: gauge,
                    label: "Final result",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Final-Result",
                    route: `final-result?${subItemRoute(locationParms.slice(1), 'student', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/final-result/student"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Transfer",
                    route: `transfer?${subItemRoute(locationParms.slice(1), 'student', filterDataElements, true)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/transfer/student"
                }
            ]
        },
        {
            displayInMenu: true,
            title: "Staff",
            subItems: [
                {
                    icon: userGroup,
                    label: "Staff registry",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Enrollment",
                    route: `enrollment?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/enrollment/staff"
                },
                {
                    icon: glyph,
                    label: "Attendance",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Attendance",
                    route: `attendance?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/attendance/staff"
                },
                {
                    icon: logOut,
                    label: "Transfer",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Transfer",
                    route: `transfer?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements, true)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/transfer/staff"
                },
                {
                    icon: gauge,
                    label: "Re-enroll",
                    showBadge: false,
                    disabled: false,
                    appName: "SEMIS-Staff-Re-enroll",
                    route: `final-result?${subItemRoute(locationParms.slice(1), 'staff', filterDataElements)}`,
                    displayInMenu: true,
                    active: false,
                    appUrl: "/final-result/staff"
                }
            ]
        }
    ]
}
export { sideBarData }
