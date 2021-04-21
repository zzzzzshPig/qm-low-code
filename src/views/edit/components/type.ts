import { ParamType } from '@/views/edit/components/helper'

export type PropValue =  {
    label: string
    type: ParamType,
    value: string | number | boolean
}

export type MyParams = {
    [index: string]: PropValue
}

export type MyProps = {
    [K: string]: {
        type: ObjectConstructor,
        default: () => PropValue
    }
}

export type GetPropsType<T> = {
    [K in keyof T]: PropValue
}
