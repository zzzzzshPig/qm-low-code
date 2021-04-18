import { defineComponent, render, createVNode, ref } from 'vue'
import Image from './components/image/export'
import { MyParams, VueComponent } from '@/views/edit/components/type'
import { ExportConfig, ParamType } from '@/views/edit/components/helper'

const classId = 0
const propList = ref<MyParams>({})

function showPropSetPanel (config: ExportConfig<MyParams>) {
    propList.value = config.params
}

function renderComponent (config: ExportConfig<MyParams>) {
    const container = document.createElement('div')
    container.className = `_container_class_${classId}`
    container.onclick = showPropSetPanel.bind(null, config)

    // need renderId
    render(createVNode(config.component), container)

    const canvas = document.querySelector('.canvas') as HTMLDivElement
    canvas.appendChild(container)
}

const componentList = [Image]

export default defineComponent({
    setup () {
        return {
            paramType: ParamType,
            propList,
            componentList,
            renderComponent
        }
    }
})
