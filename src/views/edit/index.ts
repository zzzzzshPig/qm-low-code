import { defineComponent, reactive, ref } from 'vue'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { initComponentEvent, initComponentStyle, initProps, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'
import { EditComponent } from '@/views/edit/types'

let id = 0

const propList = ref<MyParams<unknown>>({})

const components = ref<EditComponent[]>([])

function renderComponent<T extends MyProps<T>> (item: MyComponentConfig) {
    const props = reactive(initProps(item))

    const component: EditComponent = {
        name: item.name,
        id: ++id,
        props: props,
        className: {},
        style: initComponentStyle(props) as never,
        event: initComponentEvent(props)
    }

    return component
}

function highlightComponent (component: EditComponent) {
    components.value.forEach(a => {
        a.className.select = false
    })

    component.className.select = true
}

function insertComponent (component: EditComponent) {
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
        // 模拟获取保存的数据
        const id = 123
        function getDataById (): EditComponent[] {
            if (id) {
                return []
            }

            return []
        }

        components.value = getDataById()

        const withdrawal = createWithdrawal()

        function selectComponent (component: EditComponent) {
            propList.value = component.props

            // 高亮组件
            highlightComponent(component)
        }

        return {
            paramType: ParamType,
            propList,
            components,
            componentList,
            addComponent: (item: MyComponentConfig) => {
                const component = renderComponent(item)

                withdrawal.push(() => {
                    components.value.pop()
                    selectComponent(components.value[components.value.length - 1])
                }, () => {
                    components.value.push(component)
                    selectComponent(component)
                })

                insertComponent(component)
            },
            selectComponent
        }
    }
})
