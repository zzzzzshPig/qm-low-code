import { stringProp, numberProp, baseProps, cmtBaseStyle } from '../helper'
import { computed, defineComponent, ref, watchEffect } from 'vue'

function getInputId () {
    return `myInput${Date.now()}`
}

export default defineComponent({
    name: 'ZInput',

    props: {
        ...baseProps(),
        height: numberProp(32),
        text: stringProp(''),
        color: stringProp(),
        fontSize: numberProp(16),
        fontWeight: numberProp(400),
        lineHeight: numberProp(24),
        inputType: stringProp('text'),
        id: stringProp(getInputId()),
        placeholder: stringProp('请输入'),
        borderWidth: numberProp(1),
        borderColor: stringProp('#d9d9d9'),
        borderStyle: stringProp('solid'),
        borderRadius: numberProp(2)
    },

    emits: ['update:value'],

    setup (props) {
        const modelValue = ref(props.text)

        function change () {
            if (props.inputType === 'tel') {
                modelValue.value = modelValue.value.replace(/[^0-9]+/, '')
                console.log(modelValue.value)
            }
        }

        watchEffect(() => {
            modelValue.value = props.text
            change()
        })

        return {
            modelValue,

            baseStyle: computed(() => {
                return {
                    ...cmtBaseStyle(props).value,
                    fontSize: `${props.fontSize}px`,
                    color: props.color,
                    fontWeight: props.fontWeight,
                    lineHeight: `${props.lineHeight}px`
                }
            }),

            change
        }
    }
})
