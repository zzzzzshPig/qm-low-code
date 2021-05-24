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
        zIndex: numberProp(),
        width: numberProp(100),
        height: numberProp(100),
        left: numberProp(),
        top: numberProp(),
        backgroundColor: stringProp(),
        borderRadius: numberProp(),
        borderWidth: numberProp(),
        borderColor: stringProp(),
        borderStyle: numberProp(),
        translateX: numberProp()
    }
}
