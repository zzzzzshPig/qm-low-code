import { MyDefineComponent, stringProp, ComponentName, colorProp } from '../helper'
import image from './image.svg'

export default MyDefineComponent({
    name: ComponentName.Text,

    label: '文本',

    image,

    props: {
        height: stringProp('高度', '24px'),
        text: stringProp('文本', '默认文本'),
        color: colorProp('文字颜色'),
        fontSize: stringProp('文字大小', '16px'),
        fontWeight: stringProp('文字粗细')
    },

    setup () {
        return {
        }
    }
})
