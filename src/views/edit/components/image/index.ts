import { defineComponent, ref } from 'vue'
import { baseProps, initComponent, stringProp } from '@/views/edit/components/helper'
import image from '@/views/edit/components/image/image.svg'
import { GetPropsType } from '@/views/edit/components/type'

export default defineComponent({
    props: {
        ...baseProps(),
        src: stringProp('图片地址', image)
    },

    setup (props) {
        const root = ref<HTMLImageElement | null>(null)
        const params = props as GetPropsType<typeof props>

        initComponent(root, params)

        return {
            root
        }
    }
})
