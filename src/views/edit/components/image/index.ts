import { defineComponent, ref } from 'vue'
import { compilerParamsToProps, initComponent } from '@/views/edit/components/helper'
import { imageParams } from './export'

export default defineComponent({
    props: compilerParamsToProps(imageParams()),

    setup (props) {
        const root = ref<HTMLImageElement | null>(null)
        const params = props as ReturnType<typeof imageParams>

        initComponent(root, params)

        return {
            root
        }
    }
})
