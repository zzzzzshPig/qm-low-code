import { MyDefineComponent, stringProp } from '@/views/edit/components/helper'
import image from '@/views/edit/components/image/image.svg'
import { ComponentType } from '@/views/edit/components/const'

export default MyDefineComponent({
    componentId: ComponentType.Image,

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
