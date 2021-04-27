import { defineComponent, reactive, ref, watchEffect } from 'vue'
import { MyParams, MyProps } from '@/views/edit/components/type'
import { initComponentEvent, initComponentStyle, initProps, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'
import { cloneDeep } from 'lodash'
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
        style: initComponentStyle(props) as never,
        event: initComponentEvent(props)
    }

    insertComponent(component)
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
        let limit = false

        watchEffect(() => {
            if (limit) {
                limit = false
                return
            }

            // 虽然数据被修改是会被回撤的，理论上回撤到这里数据和当初保存的应该是一致的
            // 但是为了后续有可能会扩展不需要记录回撤的属性值，所以这里还是选择clone一份
            const oldData = cloneDeep(components.value)

            let restoreData !: EditComponent[]

            withdrawal.push(() => {
                restoreData = components.value
                components.value = oldData
                limit = true
            }, () => {
                components.value = restoreData
                limit = true
            })
        })

        return {
            paramType: ParamType,
            propList,
            components,
            componentList,
            renderComponent,
            showPropSetPanel (params: MyParams<unknown>) {
                propList.value = params
            }
        }
    }
})
