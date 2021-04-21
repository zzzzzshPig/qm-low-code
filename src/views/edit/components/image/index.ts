import { defineComponent } from 'vue'
import { stringProp } from '@/views/edit/components/helper'
import image from '@/views/edit/components/image/image.svg'

export default defineComponent({
    props: {
        src: stringProp('图片地址', image)
    },

    setup () {
        return {
        }
    }
})
