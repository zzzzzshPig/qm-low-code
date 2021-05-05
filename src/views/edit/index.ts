import { defineComponent, onUnmounted, reactive, ref, watch, computed } from 'vue'
import { MyProps } from '@/views/edit/components/type'
import { initComponentStyle, initProps, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'
import { EditComponent } from '@/views/edit/types'
import { cloneDeep } from 'lodash'

const components = ref<EditComponent[]>([])

function useCanvasPanel () {
    const data = components

    let id = 0

    function render<T extends MyProps<T>> (item: MyComponentConfig) {
        const props = reactive(initProps(item))

        const component: EditComponent = {
            name: item.name,
            id: ++id,
            props: props,
            select: false
        }

        return component
    }

    function getData () {
        // 模拟获取保存的数据
        const id = 123

        function getDataById (): EditComponent[] {
            if (id) {
                return []
            }

            return []
        }

        data.value = getDataById()
    }
    getData()

    function insert (component: EditComponent) {
        data.value.push(component)
    }

    let lastComponent: EditComponent

    function select (component: EditComponent) {
        if (component.select) {
            return
        }

        if (lastComponent) {
            lastComponent.select = false
        }

        lastComponent = component
        component.select = true
    }

    function noSelect () {
        if (lastComponent) {
            lastComponent.select = false
        }
    }

    return {
        data,
        select,
        noSelect,
        insert,
        render
    }
}

// 属性面板相关
function usePropPanel () {
    const data = computed(() => {
        const component = components.value.filter(a => a.select)[0]

        if (!component) return undefined

        return component.props
    })
    const inputType = ParamType

    return {
        data,
        inputType
    }
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
        const propPanel = usePropPanel()
        const canvasPanel = useCanvasPanel()
        const withdrawal = createWithdrawal<EditComponent[]>()

        onUnmounted(() => {
            withdrawal.destroy()
        })

        withdrawal.push(cloneDeep(canvasPanel.data.value), 0)

        // target 修改前的状态
        // source 修改后的状态
        // function diffComponent (old: EditComponent[], now: EditComponent[]) {
        //     const len = Math.max(old.length, now.length)
        //
        //     for (let i = 0; i < len; i++) {
        //         const o = old[i]
        //         const n = now[i]
        //
        //         // 新增删除组件
        //         if (!o || !n || o.id !== n.id) {
        //             console.log('组件被修改')
        //             break
        //         } else if (JSON.stringify(o.props) !== JSON.stringify(n.props)) {
        //             // 属性发生修改
        //             console.log('属性发生修改')
        //             break
        //         }
        //     }
        // }

        function watchComponents () {
            let skipWatch = false

            watch(canvasPanel.data, () => {
                if (skipWatch) {
                    skipWatch = false
                    return
                }

                withdrawal.push(cloneDeep(canvasPanel.data.value))
            }, {
                deep: true
            })

            function update (data: EditComponent[]) {
                // diffComponent(canvasPanel.data.value, data)

                canvasPanel.data.value = cloneDeep(data)

                skipWatch = true
            }

            withdrawal.onRevoke(update)
            withdrawal.onRestore(update)
        }
        watchComponents()

        return {
            componentList,
            inputType: propPanel.inputType,
            propList: propPanel.data,
            components: canvasPanel.data,
            addComponent (item: MyComponentConfig) {
                const component = canvasPanel.render(item)
                canvasPanel.insert(component)
            },
            selectComponent: canvasPanel.select,
            noSelectComponent: canvasPanel.noSelect,
            initComponentStyle
        }
    }
})
