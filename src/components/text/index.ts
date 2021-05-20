import { MyDefineComponent, stringProp, ComponentName, colorProp, numberProp } from '../helper'
import image from './image.svg'

export default MyDefineComponent({
    name: ComponentName.Text,

    label: '文本',

    image,

    props: {
        height: numberProp('高度', 24),
        text: stringProp('文本', '默认文本'),
        color: colorProp('文本颜色'),
        fontSize: stringProp('字体大小', '16px'),
        fontWeight: stringProp('字体粗细', '400'),
        lineHeight: stringProp('行间距', '24px')
    },

    setup () {
        return {
        }
    }
})
