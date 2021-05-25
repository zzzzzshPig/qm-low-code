import { baseProps } from 'qm-lowCode-component'

export type BasePropType = ReturnType<typeof baseProps>

export type BasePropTypeKeys = keyof BasePropType

type BasePropValueType<K extends BasePropTypeKeys> = BasePropType[K]['default']

type BasePropTypeType<K extends BasePropTypeKeys> = BasePropType[K]['type']

export type PropValueType = number | string | boolean

export type ComponentListItem = {
    label: string
    name: string
    image: string
    props: BasePropType
}

export type ImportComponent = {
    name: string
    props: {
        [K in BasePropTypeKeys]: {
            type: BasePropTypeType<K>
            default: BasePropValueType<K>
        }
    }
}

export type EditComponent = {
    name: string
    id: number
    props: {
        [K in BasePropTypeKeys]: BasePropValueType<K>
    }
}
