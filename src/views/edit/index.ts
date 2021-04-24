import { defineComponent, ref, reactive } from 'vue'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { baseProps, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, convertProps, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'

let id = 0
const propList = ref<MyParams<unknown>>({})
const components = ref<Array<{ name: MyComponentConfig['name'], id: number, props: MyParams<unknown> }>>([])

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

    const component = {
        name: item.name,
        id: ++id,
        props
    }
    components.value.push(component)

    // initComponent(container.children[0] as HTMLElement, props)
    return component
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
                const component = renderComponent(item)

                withdrawal.push((action) => {
                    console.log(action, component)
                })
            },
            showPropSetPanel (params: MyParams<unknown>) {
                propList.value = params
            }
        }
    }
})
