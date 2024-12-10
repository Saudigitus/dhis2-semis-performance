interface FlyoutComponentProps {
    options: FlyoutOptionsProps[]
}

interface FlyoutOptionsProps {
    label: string
    divider: boolean
    onClick: () => void
    disabled: boolean
}

export type { FlyoutOptionsProps, FlyoutComponentProps }
