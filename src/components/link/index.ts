import { cmtTextPropStyle, numberProp, stringProp, textProps } from '../helper'
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'ZLink',

    props: {
        ...textProps(),
        href: stringProp(''),
        height: numberProp(24),
        text: stringProp('超链接文本'),
        target: stringProp('_blank')
    },

    setup (props) {
        return {
            baseStyle: cmtTextPropStyle(props)
        }
    }
})
