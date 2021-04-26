import { ComponentName } from '@/views/edit/components/const'
import { GetPropsType, MyProps } from '@/views/edit/components/type'
import { computed, defineComponent, SetupContext } from 'vue'
import { convertProps } from '@/views/edit/helper'

export type MyComponentConfig<T extends MyProps<T> = Record<string, never>> = {
    label: string
    props: T
    image: string
    name: ComponentName
    emits?: string[]
    setup: (this: void, props: GetPropsType<T & ReturnType<typeof baseProps>>, ctx: SetupContext) => void
}
export function MyDefineComponent<T extends MyProps<T>> (config: MyComponentConfig<T>): MyComponentConfig<T> {
    // eslint-disable-next-line
    return defineComponent(config as any) as any
}

export enum ParamType {
    string,
    number
}

export function numberProp (label = '', value = 0) {
    return {
        type: Object,
        default: () => {
            return {
                type: ParamType.number,
                label,
                value
            }
        }
    }
}

export function stringProp (label = '', value = '') {
    return {
        type: Object,
        default: () => {
            return {
                type: ParamType.string,
                label,
                value
            }
        }
    }
}

export function baseProps () {
    return {
        width: numberProp('宽度', 100),
        height: numberProp('高度', 100),
        x: numberProp('水平位置', 0),
        y: numberProp('垂直位置', 0)
    }
}

type InitParams = GetPropsType<ReturnType<typeof baseProps>>

export function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    const props = {
        ...baseProps(),
        ...component.props
    }

    component.props = props

    return convertProps(props)
}

// 生成组件的基础属性
export function initComponentStyle (params: InitParams) {
    return computed(() => {
        return {
            position: 'absolute',
            left: `${params.x.value}px`,
            top: `${params.y.value}px`,
            width: `${params.width.value}px`,
            height: `${params.height.value}px`
        }
    })
}

// 绑定组件的基础事件，拖拽，移动等
export function initComponentEvent (props: InitParams) {
    return {
        click () {
            console.log(props)
        }
    }
}
