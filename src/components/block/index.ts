import { baseProps, cmtBaseStyle, stringProp } from '../helper'
import { computed, defineComponent } from 'vue'

export default defineComponent({
    name: 'ZBlock',

    props: {
        ...baseProps(),
        backgroundColor: stringProp('#000')
    },

    setup (props) {
        return {
            baseStyle: computed(() => {
                return {
                    ...cmtBaseStyle(props).value,
                    backgroundColor: props.backgroundColor
                }
            })
        }
    }
})
