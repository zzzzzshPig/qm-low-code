import { defineComponent, onUnmounted, reactive, ref, watch, computed } from 'vue'
import { MyProps } from '@/views/edit/components/type'
import { initComponentStyle, initProps, MyComponentConfig, ParamType } from '@/views/edit/components/helper'
import { componentList, createWithdrawal } from './helper'
import { ComponentName } from '@/views/edit/components/const'
import { EditComponent } from '@/views/edit/types'
import { cloneDeep } from 'lodash'

const components = ref<EditComponent[]>([])

function getComponentById (id: EditComponent['id']) {
    for (const a of components.value) {
        if (a.id === id) {
            return a
        }
    }
}

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

    let lastComponentId: EditComponent['id']

    function select (component: EditComponent) {
        if (component.select) {
            return
        }

        noSelect()

        lastComponentId = component.id
        component.select = true
    }

    function noSelect () {
        const lastComponent = getComponentById(lastComponentId)

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
    // 显示被选中的元素的props
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

        const skipWatch = ref(false)

        function watchComponents () {
            withdrawal.push(cloneDeep(canvasPanel.data.value), 0)

            watch(canvasPanel.data, () => {
                if (skipWatch.value) {
                    skipWatch.value = false
                    return
                }

                withdrawal.push(cloneDeep(canvasPanel.data.value))
            }, {
                deep: true
            })

            function update (data: EditComponent[]) {
                canvasPanel.data.value = cloneDeep(data)

                skipWatch.value = true
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
            initComponentStyle,
            // 禁用输入框默认的回撤功能
            disableKeydownEventDefaultWithdrawal (e: KeyboardEvent) {
                const isZ = e.key === 'z'

                if (e.metaKey && isZ) {
                    e.preventDefault()
                }
            }
        }
    }
})
