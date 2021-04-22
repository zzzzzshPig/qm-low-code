import { defineComponent, render, createVNode, ref, reactive } from 'vue'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { baseProps, initComponent, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, convertProps, getComponentById } from './helper'

let id = 0
const propList = ref<MyParams<unknown>>({})

function showPropSetPanel<T> (params: MyParams<T>) {
    propList.value = params
}

// eslint-disable-next-line
function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    const props = {
        ...baseProps(),
        ...component.props
    }

    component.props = props

    // eslint-disable-next-line
    return reactive(convertProps(props))
}

function renderComponent<T extends MyProps<T>> (config: {
    componentId: MyComponentConfig['componentId'],
    props: T
}) {
    const component = getComponentById(config.componentId)
    const props = initProps(component)
    const container = createComponent(component, props)

    console.log({
        componentId: config.componentId,
        id: ++id,
        props
    })

    initComponent(container.children[0] as HTMLElement, props)
    insertComponent(container)
}

// eslint-disable-next-line
function createComponent<T extends MyParams<T>> (component: MyComponentConfig, params: T) {
    const container = document.createElement('div')
    container.onclick = showPropSetPanel.bind(null, params)

    // need renderId
    render(createVNode(component, params), container)

    return container
}

function insertComponent (dom: Element) {
    const canvas = document.querySelector('.canvas') as HTMLDivElement
    canvas.appendChild(dom)
}

export default defineComponent({
    setup () {
        console.log(componentList)

        return {
            paramType: ParamType,
            propList,
            componentList,
            renderComponent
        }
    }
})
