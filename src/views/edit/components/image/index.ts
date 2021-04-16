import { defineComponent, reactive } from 'vue'
import { baseProps } from '@/views/edit/components/helper'
import { MyParams } from '@/views/edit/components/type'

const params: MyParams = reactive({
    ...baseProps()
})

export default defineComponent({
    params,

    setup () {
        return {
            params
        }
    }
})
