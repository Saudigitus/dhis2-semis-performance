
interface SideBarItemProps {
    title: string
    displayInMenu: boolean
    subItems: SideBarSubItemProps[]
}

interface SideBarItemTitleProps {
    title: string
}

interface SideBarSubItemProps {
    label: string
    showBadge: boolean
    icon: string
    disabled: boolean
    route: string
    appName: string
    appUrl?: string
    displayInMenu: boolean
    active: boolean
}

interface SideBarCollapseProps {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
}


interface BadgeProps {
    value: string
}
export type { SideBarItemProps, SideBarItemTitleProps, SideBarSubItemProps, SideBarCollapseProps, BadgeProps }
