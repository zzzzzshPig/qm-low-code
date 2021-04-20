import { defineComponent, render, createVNode, ref, reactive } from 'vue'
import Image from './components/image/export'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { ExportConfig, ParamType } from '@/views/edit/components/helper'

let classId = 0
const propList = ref<MyParams>({})

function showPropSetPanel (params: MyParams) {
    propList.value = params
}

function convertProps (props: MyProps) {
    const res: MyParams = {}
    const keys = Reflect.ownKeys(props) as string[]

    keys.forEach(a => {
        const prop = props[a]
        res[a] = prop.default()
    })

    return res
}

async function renderComponent (config: {
    component: ExportConfig['component']
    componentId: ExportConfig['componentId'],
    props: MyProps
}) {
    const component = config.component
    const container = document.createElement('div')
    const props = reactive(convertProps(component.props))

    container.className = `_container_class_${++classId}`
    container.onclick = showPropSetPanel.bind(null, props)

    // need renderId
    render(createVNode(component, props), container)
    console.log({
        componentId: config.componentId,
        id: 0,
        props
    })

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
