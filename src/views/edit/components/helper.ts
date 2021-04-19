import { ComponentType } from '@/views/edit/components/const'
import { MyParams, VueComponent } from '@/views/edit/components/type'
import { Ref, watch, watchEffect } from 'vue'

type MyPropType<T> = {
    [key in keyof T]: {
        type: ObjectConstructor,
        default: MyParams['x']
    }
}

export enum ParamType {
    string,
    number
}

export function compilerParamsToProps<T extends MyParams> (params: T) {
    const res: MyPropType<T> = {} as never

    console.log(params)
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
    componentId: ComponentType
    component: VueComponent
    image: string
    label: string
    params: T
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

type InitPropType = ReturnType<typeof baseProps>

// 组件的初始化部分
// 生成组件的基础属性
// 绑定组件的基础事件
export function initComponent (root: Ref<HTMLElement | null>, props: InitPropType) {
    watch(root, init)

    function init () {
        const dom = root.value

        if (dom) {
            initComponentStyle(dom, props)
            initComponentEvent(dom, props)
        }
    }
}

function initComponentStyle (dom: HTMLElement, props: InitPropType) {
    const style = dom.style
    style.position = 'absolute'

    watchEffect(() => {
        style.left = `${props.x}px`
        style.top = `${props.y}px`
        style.width = `${props.width}px`
        style.height = `${props.height}px`
    })
}

function initComponentEvent (dom: HTMLElement, props: InitPropType) {
    console.log(props)
}
