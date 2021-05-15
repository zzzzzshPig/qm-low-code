import { MyComponentConfig, MyProps, ParamType } from './'
import { defineComponent } from 'vue'

export enum ComponentName {
    Image = 'image-component'
}

export function MyDefineComponent<T extends MyProps<T>> (config: MyComponentConfig<T>): MyComponentConfig<T> {
    // eslint-disable-next-line
    return defineComponent(config as any) as any
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

export function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    component.props = {
        ...baseProps(),
        ...component.props
    }
}
