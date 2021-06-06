import { numberProp, textProps, cmtTextPropStyle, stringProp } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZText',

    props: {
        ...textProps(),
        height: numberProp(20),
        text: stringProp('这是一个文本框')
    },

    setup (props) {
        return {
            baseStyle: cmtTextPropStyle(props)
        }
    }
})
