import { MyDefineComponent, stringProp } from '@/views/edit/components/helper'
import image from '@/views/edit/components/image/image.svg'
import { ComponentName } from '@/views/edit/components/const'

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
