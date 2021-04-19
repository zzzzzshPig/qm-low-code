import { ComponentType } from '../const'
import { reactive } from 'vue'
import { baseProps, getExportConfig, stringProp } from '@/views/edit/components/helper'
import image from './image.svg'
import component from './index.vue'

export const imageParams = {
    ...baseProps(),
    src: stringProp('图片地址', image)
}

export default getExportConfig({
    componentId: ComponentType.Image,
    label: '图片',
    image,
    component,
    params: reactive(imageParams)
})
