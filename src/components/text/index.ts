import { numberProp, textProps, cmtTextPropStyle } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZText',

    props: {
        ...textProps(),
        height: numberProp(24)
    },

    setup (props) {
        return {
            baseStyle: cmtTextPropStyle(props)
        }
    }
})
