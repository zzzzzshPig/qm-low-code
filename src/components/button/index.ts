import { numberProp, textProps, stringProp, cmtTextPropStyle, booleanProp } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZButton',

    props: {
        ...textProps(),
        text: stringProp('按钮'),
        height: numberProp(32),
        borderRadius: numberProp(2),
        inputId: stringProp(),
        houseId: numberProp(),
        shouldMsgCode: booleanProp()
    },

    setup (props) {
        return {
            baseStyle: cmtTextPropStyle(props)
        }
    }
})
