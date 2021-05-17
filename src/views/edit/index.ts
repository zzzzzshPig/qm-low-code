import { defineComponent, onUnmounted, ref, watch, computed } from 'vue'
import { MyProps, MyComponentConfig, ParamType, BasePropsType } from 'qm-lowCode-component'
import { componentList, createWithdrawal, initComponentStyle, initProps } from './helper'
import { EditComponent } from '@/views/edit/types'
import { cloneDeep } from 'lodash'
import { useRoute } from 'vue-router'
import { apiEdit } from '@/apis/edit'

const components = ref<EditComponent[]>([])

// function getComponentById (id: EditComponent['id']) {
//     for (const a of components.value) {
//         if (a.id === id) {
//             return a
//         }
//     }
// }

const selectComponentId = ref<number>()
const selectComponent = computed<EditComponent | undefined>(() => {
    return components.value.filter(a => a.id === selectComponentId.value)[0]
})

function useCanvasPanel () {
    const data = components
    const id = Number(useRoute().params.id)
    const uid = computed(() => {
        return components.value[components.value.length - 1].id + 1
    })

    function render<T extends MyProps<T>> (item: MyComponentConfig) {
        const props = initProps(item)

        const component: EditComponent = {
            name: item.name,
            id: uid.value,
            props: props
        }

        return component
    }

    async function saveData () {
        await apiEdit.saveData({
            id,
            data: data.value
        })
    }

    async function getData () {
        const { data: res } = await apiEdit.getData({
            id
        })

        data.value = res
    }
    getData()

    function insert (component: EditComponent) {
        data.value.push(component)
    }

    function select (component: EditComponent) {
        selectComponentId.value = component.id
    }

    function noSelect () {
        selectComponentId.value = undefined
    }

    const cmtSelectStyle = computed(() => {
        if (!selectComponent.value) {
            return
        }

        const padding = 16
        const halfPadding = padding / 2
        const props = selectComponent.value.props as BasePropsType

        return {
            width: `${props.width.value + padding}px`,
            height: `${props.height.value + padding}px`,
            top: `${props.top.value - halfPadding}px`,
            left: `${props.left.value - halfPadding}px`
        }
    })

    return {
        data,
        select,
        noSelect,
        insert,
        render,
        saveData,
        cmtSelectStyle
    }
}

// 属性面板相关
function usePropPanel () {
    const inputType = ParamType

    return {
        inputType
    }
}

export default defineComponent({
    components: (() => {
        const res: Record<string, MyComponentConfig> = {} as never

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
            save: canvasPanel.saveData,
            componentList,
            inputType: propPanel.inputType,
            components: canvasPanel.data,
            addComponent (item: MyComponentConfig) {
                const component = canvasPanel.render(item)
                canvasPanel.insert(component)
            },
            select: canvasPanel.select,
            noSelect: canvasPanel.noSelect,
            initComponentStyle,
            selectComponent,
            cmtSelectStyle: canvasPanel.cmtSelectStyle
        }
    }
})
