import { defineComponent, ref, reactive } from 'vue'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { baseProps, initComponent, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, convertProps, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'

let id = 0
const propList = ref<MyParams<unknown>>({})

type ComponentItem = {
    name: MyComponentConfig['name']
    id: number
    className: string
    props: MyParams<unknown>
}
const components = ref<ComponentItem[]>([])

function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    const props = {
        ...baseProps(),
        ...component.props
    }

    component.props = props

    return reactive(convertProps(props))
}

function renderComponent<T extends MyProps<T>> (item: MyComponentConfig) {
    const props = initProps(item)

    const componentId = ++id
    const component = {
        className: `random_dom_class_${componentId}`,
        name: item.name,
        id: componentId,
        props
    }

    setTimeout(() => {
        initComponent(document.querySelector(`.${component.className}`) as HTMLElement, props)
    }, 0)
    return component
}

function insertComponent (component: ComponentItem) {
    components.value.push(component)
}

export default defineComponent({
    components: (() => {
        const res: Record<ComponentName, MyComponentConfig> = {} as never

        componentList.forEach(a => {
            res[a.name] = a
        })

        return res
    })(),

    setup () {
        const withdrawal = createWithdrawal()

        return {
            paramType: ParamType,
            propList,
            components,
            componentList,
            renderComponent (item: MyComponentConfig) {
                // 使用下标记录，如果之前的组件的值发生改变则会产生bug
                // 目前暂时没有会改变的情况
                const nowIndex = components.value.length
                let restoreComponent!: ComponentItem[]

                withdrawal.push(() => {
                    restoreComponent = components.value
                    components.value = components.value.slice(0, nowIndex)
                }, () => {
                    components.value = restoreComponent
                }, 0)

                insertComponent(renderComponent(item))
            },
            showPropSetPanel (params: MyParams<unknown>) {
                propList.value = params
            }
        }
    }
})
