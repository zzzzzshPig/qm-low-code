import { defineComponent, render, createVNode, ref, reactive } from 'vue'
import Image from './components/image/export'
import { MyParams } from '@/views/edit/components/type'
import { ExportConfig, ParamType } from '@/views/edit/components/helper'

let classId = 0
const propList = ref<MyParams>({})

function showPropSetPanel (params: MyParams) {
    propList.value = params
}

async function renderComponent (config: ExportConfig<MyParams>) {
    const { default: component } = await config.component
    const container = document.createElement('div')
    const params = reactive(config.params())

    container.className = `_container_class_${++classId}`
    container.onclick = showPropSetPanel.bind(null, params)

    // need renderId
    render(createVNode(component, params), container)

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
