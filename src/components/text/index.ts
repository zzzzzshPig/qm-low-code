import { stringProp, numberProp, baseProps, cmtBaseStyle } from '../helper'
import { computed, defineComponent } from 'vue'

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

    setup (props) {
        return {
            baseStyle: computed(() => {
                return {
                    ...cmtBaseStyle(props).value,
                    fontSize: `${props.fontSize}px`,
                    color: props.color,
                    fontWeight: props.fontWeight,
                    lineHeight: `${props.lineHeight}px`
                }
            })
        }
    }
})
