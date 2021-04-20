import { ComponentType } from '../const'
import { baseProps, getExportConfig, stringProp } from '@/views/edit/components/helper'
import image from './image.svg'

export const imageParams = () => {
    return {
        ...baseProps(),
        src: stringProp('图片地址', image)
    }
}

export default getExportConfig({
    componentId: ComponentType.Image,
    label: '图片',
    image,
    component: import('./index.vue'),
    params: imageParams
})
