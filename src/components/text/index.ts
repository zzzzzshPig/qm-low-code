import { stringProp, numberProp, baseProps } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZText',

    props: {
        ...baseProps(),
        height: numberProp(24),
        text: stringProp('默认文本'),
        color: stringProp(),
        fontSize: numberProp(16),
        fontWeight: numberProp(400),
        lineHeight: numberProp(24)
    },

    setup () {
        return {
        }
    }
})
