import { MyComponentConfig, MyProps, ParamType } from './'
import { defineComponent } from 'vue'
import { LabelValueArray } from '@/types'

export enum ComponentName {
    Image = 'image-component',
    Text = 'text-component',
    Block = 'block-component'
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

export function booleanProp (label = '', value = false) {
    return {
        type: Object,
        default: () => {
            return {
                type: ParamType.boolean,
                label,
                value
            }
        }
    }
}

export function colorProp (label = '', value = '') {
    return {
        type: Object,
        default: () => {
            return {
                type: ParamType.color,
                label,
                value
            }
        }
    }
}

export function selectProp<T> (label = '', value: string | number, list: LabelValueArray<T>) {
    return {
        type: Object,
        default: () => {
            return {
                type: ParamType.select,
                label,
                value,
                list
            }
        }
    }
}

export function baseProps () {
    return {
        zIndex: numberProp('层级'),
        width: numberProp('宽度', 100),
        height: numberProp('高度', 100),
        left: numberProp('水平位置', 0),
        top: numberProp('垂直位置', 0),
        backgroundColor: colorProp('背景颜色'),
        borderRadius: numberProp('边框圆角', 0),
        borderWidth: numberProp('边框大小', 0),
        borderColor: colorProp('边框颜色'),
        borderStyle: selectProp('边框样式', 'none', [
            {
                value: 'none',
                label: '无边框'
            }, {
                value: 'solid',
                label: '实线'
            }, {
                value: 'dotted',
                label: '圆点'
            }, {
                value: 'dashed',
                label: '虚线'
            }, {
                value: 'double',
                label: '双实线'
            }, {
                value: 'groove',
                label: '雕刻效果'
            }, {
                value: 'ridge',
                label: '浮雕效果'
            }
        ]),
        translateX: numberProp('旋转')
    }
}

export function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    component.props = {
        ...baseProps(),
        ...component.props
    }
}