import { baseProps, ComponentName, initProps } from './helper'
import ImageC from './image/index.vue'
import { SetupContext } from 'vue'

// eslint-disable-next-line
const component: MyComponentConfig<MyProps<any>>[] = [ImageC] as any

// 对所有组件添加基础props
component.forEach(a => {
    initProps(a)
})

export const Image = ImageC

export enum ParamType {
    string,
    number,
    color,
    select
}

export type PropValue = {
    label: string
    type: ParamType,
    value: string | number | boolean
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

export type BasePropsType = GetPropsType<ReturnType<typeof baseProps>>

export type MyComponentConfig<T extends MyProps<T> = Record<string, never>> = {
    label: string
    props: T
    image: string
    name: ComponentName
    emits?: string[]
    setup: (this: void, props: GetPropsType<T & ReturnType<typeof baseProps>>, ctx: SetupContext) => void
}
