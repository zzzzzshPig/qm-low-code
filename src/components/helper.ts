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
        left: numberProp('水平位置'),
        top: numberProp('垂直位置'),
        color: stringProp('文字颜色'),
        backgroundColor: stringProp('背景颜色'),
        fontSize: numberProp('文字大小', 16),
        fontWeight: stringProp('文字粗细'),
        borderRadius: numberProp('边框圆角'),
        borderWidth: numberProp('边框大小'),
        borderColor: stringProp('边框颜色'),
        borderStyle: stringProp('边框样式')
    }
}

export function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    component.props = {
        ...baseProps(),
        ...component.props
    }
}
