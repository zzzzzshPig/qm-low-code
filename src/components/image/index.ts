import { baseProps, cmtBaseStyle, stringProp } from '../helper'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    name: 'ZImage',

    props: {
        ...baseProps(),
        src: stringProp('')
    },

    setup (props) {
        return {
            baseStyle: computed(() => {
                return {
                    ...cmtBaseStyle(props).value,
                    src: props.src
                }
            })
        }
    }
})
