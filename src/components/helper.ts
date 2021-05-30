import { computed } from 'vue'

export function numberProp (value = 0) {
    return {
        type: Number,
        default: value
    }
}

export function stringProp (value = '') {
    return {
        type: String,
        default: value
    }
}

export function booleanProp (value = false) {
    return {
        type: Boolean,
        default: value
    }
}

export function baseProps () {
    return {
        opacity: numberProp(100),
        zIndex: numberProp(),
        width: numberProp(100),
        height: numberProp(100),
        left: numberProp(),
        top: numberProp(),
        backgroundColor: stringProp(),
        borderRadius: numberProp(),
        borderWidth: numberProp(),
        borderColor: stringProp(),
        borderStyle: stringProp('none'),
        rotate: numberProp()
    }
}

type BasePropType = ReturnType<typeof baseProps>

type BasePropTypeKeys = keyof BasePropType

type BasePropValueType<K extends BasePropTypeKeys> = BasePropType[K]['default']

export function cmtBaseStyle (props: {
    [K in BasePropTypeKeys]: BasePropValueType<K>
}) {
    return computed(() => {
        return {
            position: 'absolute',
            opacity: props.opacity / 100,
            zIndex: props.zIndex,
            width: `${props.width}px`,
            height: `${props.height}px`,
            left: `${props.left}px`,
            top: `${props.top}px`,
            backgroundColor: props.backgroundColor,
            borderRadius: `${props.borderRadius}px`,
            borderWidth: `${props.borderWidth}px`,
            borderColor: props.borderColor,
            borderStyle: props.borderStyle,
            transform: `rotate(${props.rotate}deg)`
        }
    })
}
