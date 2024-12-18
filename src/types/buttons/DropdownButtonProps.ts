import { FlyoutOptionsProps } from "./FlyoutOptionsProps"

interface DropdownButtonComponentProps {
    name: string
    icon?: React.ReactElement
    options: FlyoutOptionsProps[]
    disabled: boolean
}

export type { DropdownButtonComponentProps }
