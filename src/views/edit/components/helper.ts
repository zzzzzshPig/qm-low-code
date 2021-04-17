import { ComponentType } from '@/views/edit/components/const'
import type { DefineComponent } from 'vue'
import { MyParams } from '@/views/edit/components/type'

export enum QueryType {
    string,
    number
}

type ExportConfig = {
    componentId: ComponentType
    // eslint-disable-next-line
    component: DefineComponent<{}, {}, any>
    image: string
    label: string
    params: MyParams
}
export function getExportConfig ({ componentId, component, image, params, label }: ExportConfig) {
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
        type: QueryType.number,
        label,
        value
    }
}

export function stringProp (label = '', value = '') {
    return {
        type: QueryType.string,
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
