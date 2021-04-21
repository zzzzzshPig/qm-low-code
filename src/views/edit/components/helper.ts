import { ComponentType } from '@/views/edit/components/const'
import { PropValue } from '@/views/edit/components/type'
import { watchEffect } from 'vue'

export enum ParamType {
    string,
    number
}

export type ExportConfig = {
    componentId: ComponentType // 组件Id，用于从数据中生成组件
    // eslint-disable-next-line
    component: any // 被渲染的vue组件
    image: string // 组件的缩略图
    label: string // 组件名
}
export function getExportConfig ({ componentId, component, image, label }: ExportConfig) {
    return {
        componentId,
        component,
        image,
        label
    }
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

type InitParams = {
    [K in keyof ReturnType<typeof baseProps>]: PropValue
}

// 组件的初始化部分
export function initComponent (root: HTMLElement, params: InitParams) {
    initComponentStyle(root, params)
    initComponentEvent(root, params)
}

// 生成组件的基础属性
function initComponentStyle (dom: HTMLElement, params: InitParams) {
    const style = dom.style
    style.position = 'absolute'

    watchEffect(() => {
        style.left = `${params.x.value}px`
        style.top = `${params.y.value}px`
        style.width = `${params.width.value}px`
        style.height = `${params.height.value}px`
    })
}

// 绑定组件的基础事件，拖拽，移动等
function initComponentEvent (dom: HTMLElement, props: InitParams) {
    console.log(props)
}
