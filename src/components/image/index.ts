import { MyDefineComponent, stringProp, ComponentName } from '../helper'
import image from './image.svg'

export default MyDefineComponent({
    name: ComponentName.Image,

    label: '图片',

    image,

    props: {
        src: stringProp('图片地址', image)
    },

    setup () {
        return {
        }
    }
})
