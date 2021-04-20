import { ComponentType } from '@/views/edit/components/const'
import { MyParams } from '@/views/edit/components/type'
import { Ref, watch, watchEffect } from 'vue'

type MyPropType<T> = {
    [K in keyof T]: {
        type: ObjectConstructor,
        default: T[K]
    }
}

export enum ParamType {
    string,
    number
}

export function compilerParamsToProps<T extends MyParams> (params: T) {
    const res: MyPropType<T> = {} as never

    const keys = Reflect.ownKeys(params) as string[]

    keys.forEach((a: keyof T) => {
        const param = params[a]

        res[a] = {
            type: Object,
            default: param
        }
    })

    return res
}

export type ExportConfig<T extends MyParams> = {
    componentId: ComponentType // 组件Id，用于从数据中生成组件
    // eslint-disable-next-line
    component: Promise<{ default: any }> // 被渲染的vue组件
    image: string // 组件的缩略图
    label: string // 组件名
    params: () => T // 组件参数，在render组件的时候当props传入
}
export function getExportConfig<T extends MyParams> ({ componentId, component, image, params, label }: ExportConfig<T>) {
    return {
        componentId,
        component,
        image,
        label,
        params
    }
}

export function numberProp (label = '', value = 0) {
    return {
        type: ParamType.number,
        label,
        value
    }
}

export function stringProp (label = '', value = '') {
    return {
        type: ParamType.string,
        label,
        value
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

type InitParams = ReturnType<typeof baseProps>

// 组件的初始化部分
export function initComponent (root: Ref<HTMLElement | null>, params: InitParams) {
    watch(root, init)

    function init () {
        const dom = root.value

        if (dom) {
            initComponentStyle(dom, params)
            initComponentEvent(dom, params)
        }
    }
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
