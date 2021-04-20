import { ComponentType } from '../const'
import { getExportConfig } from '@/views/edit/components/helper'
import image from './image.svg'
import component from './index.vue'

export default getExportConfig({
    componentId: ComponentType.Image,
    label: '图片',
    image,
    component
})
