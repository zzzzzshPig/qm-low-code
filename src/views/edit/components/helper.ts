import { ComponentType } from '@/views/edit/components/const'
import { MyParams, VueComponent } from '@/views/edit/components/type'

export enum ParamType {
    string,
    number
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
