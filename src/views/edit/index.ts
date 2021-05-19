import { defineComponent, onUnmounted, ref, watch, computed, reactive, onMounted } from 'vue'
import { MyProps, MyComponentConfig, ParamType, BasePropsType, PropValue } from 'qm-lowCode-component'
import {
    addNumberOrString,
    componentList,
    createWithdrawal,
    divisionNumberOrString,
    initComponentStyle,
    initProps,
    isSaveKeydown,
    numberToString,
    reduceNumberOrString,
    registerKeydownEvent
} from './helper'
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

type UseComponent = ReturnType<typeof useComponent>

// component
function useComponent () {
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
            props
        }

        return component
    }

    function insert (component: EditComponent) {
        components.value.push(component)

        return component
    }

    function add (item: MyComponentConfig) {
        return insert(render(item))
    }

    function remove (item: EditComponent) {
        for (let i = 0; i < components.value.length; i++) {
            if (item.id === components.value[i].id) {
                components.value.splice(i, 1)
                break
            }
        }
    }

    return {
        add,
        remove
    }
}

function useDrag (component: UseComponent) {
    let dragItem: null | MyComponentConfig = null

    function start (item: MyComponentConfig) {
        dragItem = item
    }

    function end (e: DragEvent) {
        if (!dragItem) {
            return
        }

        const c = component.add(dragItem)
        c.props.top.value = numberToString(reduceNumberOrString(e.offsetY, divisionNumberOrString(c.props.height.value, 2)))
        c.props.left.value = numberToString(reduceNumberOrString(e.offsetX, divisionNumberOrString(c.props.width.value, 2)))
    }

    function restore () {
        dragItem = null
    }

    let editComponent: null | EditComponent = null
    let initTop = 0
    let initLeft = 0

    function moveStart (e: MouseEvent, item: EditComponent) {
        initTop = e.clientY
        initLeft = e.clientX
        editComponent = item

        document.addEventListener('mouseup', moveEnd)
    }

    function move (e: MouseEvent) {
        if (!editComponent) {
            return
        }

        const nowTop = e.clientY
        const nowLeft = e.clientX

        editComponent.props.top.value = numberToString(addNumberOrString(editComponent.props.top.value, nowTop - initTop))
        editComponent.props.left.value = numberToString(addNumberOrString(editComponent.props.left.value, nowLeft - initLeft))

        initTop = nowTop
        initLeft = nowLeft
    }

    function moveEnd () {
        editComponent = null

        document.removeEventListener('mouseup', moveEnd)
    }

    return {
        start,
        end,
        move,
        restore,
        moveStart
    }
}

function useSelect (component: UseComponent) {
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

        const props = selectComponent.value.props as BasePropsType

        return {
            zIndex: props.zIndex.value,
            width: props.width.value,
            height: props.height.value,
            top: props.top.value,
            left: props.left.value,
            borderRadius: props.borderRadius.value
        }
    })

    function arrowKeys (e: KeyboardEvent) {
        if (!selectComponent.value) {
            return
        }

        const target = e.target as HTMLElement | null
        if (target && target.tagName.toLowerCase() === 'input') {
            return
        }

        const key = e.key.toLowerCase()
        const isArrowUp = key === 'arrowup'
        const isArrowDown = key === 'arrowdown'
        const isArrowLeft = key === 'arrowleft'
        const isArrowRight = key === 'arrowright'
        const isDel = key === 'delete'

        let value = 1

        if (e.shiftKey) {
            value = 10
        }

        const props = selectComponent.value.props

        if (isArrowUp) {
            props.top.value = numberToString(reduceNumberOrString(props.top.value, value))
        } else if (isArrowDown) {
            props.top.value = numberToString(addNumberOrString(props.top.value, value))
        } else if (isArrowLeft) {
            props.left.value = numberToString(reduceNumberOrString(props.left.value, value))
        } else if (isArrowRight) {
            props.left.value = numberToString(addNumberOrString(props.left.value, value))
        } else if (isDel) {
            component.remove(selectComponent.value)
        }
    }

    registerKeydownEvent(arrowKeys)

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

    function register (e: KeyboardEvent) {
        if (isSaveKeydown(e)) {
            e.preventDefault()
            saveData()
        }
    }

    registerKeydownEvent(register)

    return {
        saveData
    }
}

// colorPicker
function useColorPicker () {
    const value = ref<number>()

    onMounted(() => {
        document.addEventListener('mousedown', hide)
    })

    onUnmounted(() => {
        document.removeEventListener('mousedown', hide)
    })

    function change ({ rgba }: { rgba: { a: number, b: number, g: number, r: number} }, item: PropValue) {
        item.value = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
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
    const type = ParamType

    // format value to number
    function changeNumber (e: InputEvent, item: PropValue) {
        item.value = Number((e.target as HTMLInputElement).value)
    }

    return {
        type,
        changeNumber
    }
}

// 回撤
function useWithdrawal () {
    const withdrawal = createWithdrawal<EditComponent[]>()

    const skipWatch = ref(false)

    function watchComponents () {
        watch(components, () => {
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
        const component = useComponent()
        const propPanel = usePropPanel()
        const canvasPanel = useCanvasPanel()
        const colorPicker = useColorPicker()
        const drag = useDrag(component)
        const select = useSelect(component)

        useWithdrawal()

        return {
            drag,
            select,
            propPanel,
            colorPicker,
            components,
            componentList,
            initComponentStyle,
            save: canvasPanel.saveData
        }
    }
})
