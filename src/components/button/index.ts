import { numberProp, textProps, stringProp, cmtTextPropStyle } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZButton',

    props: {
        ...textProps(),
        text: stringProp('按钮'),
        height: numberProp(32),
        borderRadius: numberProp(2),
        inputId: stringProp()
    },

    setup (props) {
        return {
            baseStyle: cmtTextPropStyle(props)
        }
    }
})
