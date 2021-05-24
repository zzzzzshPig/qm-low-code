import { baseProps } from 'qm-lowCode-component'

export type basePropType = ReturnType<typeof baseProps>

export type basePropTypeKeys = keyof basePropType

type basePropValueType<K extends basePropTypeKeys> = basePropType[K]['default']

type basePropTypeType<K extends basePropTypeKeys> = basePropType[K]['type']

export type PropValueType = number | string | boolean

export type ComponentListItem = {
    label: string
    name: string
    image: string
    props: basePropType
}

export type ImportComponent = {
    name: string
    props: {
        [K in basePropTypeKeys]: {
            type: basePropTypeType<K>
            default: basePropValueType<K>
        }
    }
}

export type EditComponent = {
    name: string
    id: number
    props: {
        [K in basePropTypeKeys]: basePropValueType<K>
    }
}
