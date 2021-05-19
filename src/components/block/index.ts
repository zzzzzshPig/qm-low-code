import { MyDefineComponent, ComponentName, colorProp } from '../helper'
import image from './image.svg'

export default MyDefineComponent({
    name: ComponentName.Block,

    label: '块',

    image,

    props: {
        backgroundColor: colorProp('背景颜色', '#000')
    },

    setup () {
        return {
        }
    }
})
