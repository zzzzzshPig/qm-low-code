import { ComponentType } from '../const'
import { reactive } from 'vue'
import { baseProps, getExportConfig } from '@/views/edit/components/helper'
import image from './image.svg'
import component from './index.vue'

export const imageParams = reactive({
    ...baseProps()
})

export default getExportConfig({
    componentId: ComponentType.Image,
    label: '图片',
    image,
    component,
    params: imageParams
})
