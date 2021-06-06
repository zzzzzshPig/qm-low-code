import { baseProps, cmtBaseStyle, stringProp } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZBlock',

    props: {
        ...baseProps(),
        backgroundColor: stringProp('#000')
    },

    setup (props) {
        return {
            baseStyle: cmtBaseStyle(props)
        }
    }
})
