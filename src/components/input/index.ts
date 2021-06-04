import { stringProp, numberProp, baseProps, textProps, cmtTextPropStyle } from '../helper'
import { defineComponent, ref, watchEffect } from 'vue'

function getInputId () {
    return `myInput${Date.now()}`
}

export default defineComponent({
    name: 'ZInput',

    props: {
        ...textProps(),
        height: numberProp(32),
        inputType: stringProp('text'),
        id: stringProp(getInputId()),
        placeholder: stringProp('请输入'),
        borderWidth: numberProp(1),
        borderColor: stringProp('#d9d9d9'),
        borderStyle: stringProp('solid'),
        borderRadius: numberProp(2)
    },

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

            baseStyle: cmtTextPropStyle(props),

            change
        }
    }
})
