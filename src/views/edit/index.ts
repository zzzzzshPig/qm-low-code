import { defineComponent, onUnmounted, ref, watch, computed, reactive, onMounted } from 'vue'
import { MyProps, MyComponentConfig, ParamType, BasePropsType, PropValue } from 'qm-lowCode-component'
import { componentList, createWithdrawal, initComponentStyle, initProps } from './helper'
import { EditComponent } from '@/views/edit/types'
import { cloneDeep } from 'lodash'
import { useRoute } from 'vue-router'
import { apiEdit } from '@/apis/edit'
import { message } from 'ant-design-vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

const components = ref<EditComponent[]>([])

// function getComponentById (id: EditComponent['id']) {
//     for (const a of components.value) {
//         if (a.id === id) {
//             return a
//         }
//     }
// }

function useSelect () {
    const selectComponentId = ref<number>()

    const selectComponent = computed<EditComponent | undefined>(() => {
        return components.value.filter(a => a.id === selectComponentId.value)[0]
    })

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
            left: `${props.left.value - halfPadding}px`,
            borderRadius: `${props.borderRadius.value}px`
        }
    })

    return reactive({
        select,
        noSelect,
        cmtSelectStyle,
        selectComponent
    })
}

// canvas
function useCanvasPanel () {
    const id = Number(useRoute().params.id)
    const uid = computed(() => {
        const lastComponent = components.value[components.value.length - 1]

        if (!lastComponent) return 1

        return lastComponent.id + 1
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
            data: components.value
        })

        message.success('保存成功')
    }

    async function getData () {
        const { data: res } = await apiEdit.getData({
            id
        })

        components.value = res
    }
    getData()

    function insert (component: EditComponent) {
        components.value.push(component)
    }

    return {
        insert,
        render,
        saveData
    }
}

// colorPicker
function useColorPicker () {
    const value = ref<number>()

    onMounted(() => {
        document.addEventListener('click', hide)
    })

    onUnmounted(() => {
        document.removeEventListener('click', hide)
    })

    function change (value: { hex: string }, item: PropValue) {
        item.value = value.hex
    }

    function show (index: number) {
        value.value = index
    }

    function hide () {
        value.value = undefined
    }

    function canShowItem (index: number) {
        return value.value && index === value.value
    }

    return reactive({
        change,
        value,
        show,
        canShowItem
    })
}

// 属性面板相关
function usePropPanel () {
    const inputType = ParamType

    return {
        inputType
    }
}

// 回撤
function useWithdrawal () {
    const withdrawal = createWithdrawal<EditComponent[]>()

    onUnmounted(() => {
        withdrawal.destroy()
    })

    const skipWatch = ref(false)

    function watchComponents () {
        watch(components.value, () => {
            if (skipWatch.value) {
                skipWatch.value = false
                return
            }

            withdrawal.push(cloneDeep(components.value))
        }, {
            deep: true
        })

        function update (data: EditComponent[]) {
            components.value = cloneDeep(data)

            skipWatch.value = true
        }

        withdrawal.onRevoke(update)
        withdrawal.onRestore(update)
    }

    watchComponents()
}

function getComponents () {
    const res: Record<string, MyComponentConfig> = {} as never

    componentList.forEach(a => {
        res[a.name] = a
    })

    return {
        ...res,
        ColorPicker
    }
}

export default defineComponent({
    components: getComponents(),

    setup () {
        const select = useSelect()
        const propPanel = usePropPanel()
        const canvasPanel = useCanvasPanel()
        const colorPicker = useColorPicker()

        useWithdrawal()

        return {
            select,
            colorPicker,
            components,
            componentList,
            initComponentStyle,
            save: canvasPanel.saveData,
            inputType: propPanel.inputType,
            addComponent (item: MyComponentConfig) {
                const component = canvasPanel.render(item)
                canvasPanel.insert(component)
            }
        }
    }
})
