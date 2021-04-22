import { ParamType } from '@/views/edit/components/helper'

export type PropValue = {
    label: string
    type: ParamType,
    value: string | number | boolean
}

export type MyParams<T> = {
    [K in keyof T]: PropValue
}

export type MyProps<T> = {
    [K in keyof T]: {
        type: ObjectConstructor,
        default: () => PropValue
    }
}

export type GetPropsType<T extends MyProps<T>> = {
    [K in keyof T]: ReturnType<T[K]['default']>
}
