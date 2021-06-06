import { baseProps, cmtBaseStyle, stringProp } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZImage',

    props: {
        ...baseProps(),
        src: stringProp('')
    },

    setup (props) {
        return {
            baseStyle: cmtBaseStyle(props)
        }
    }
})
