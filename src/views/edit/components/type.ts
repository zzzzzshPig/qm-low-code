import { ParamType } from '@/views/edit/components/helper'

export type MyParams = {
    [index: string]: {
        label: string
        type: ParamType,
        value: string | number | boolean
    }
}

export type MyProps = {
    [K: string]: {
        type: ObjectConstructor,
        default: () => MyParams['x']
    }
}

export type GetPropsType<T> = {
    [K in keyof T]: MyParams['x']
}
