import { defineComponent, ref, watch, computed, reactive } from 'vue'
import {
    importComponents,
    createWithdrawal,
    initProps,
    isSaveKeydown,
    componentList,
    componentNames,
    registerWindowKeyDown,
    skipPushWithdrawal,
    isRestoreKeydown,
    isRevokeKeydown
} from './helper'
import { EditComponent, ImportComponent } from '@/views/edit/types'
import { cloneDeep } from 'lodash'
import { useRoute } from 'vue-router'
import { apiEdit } from '@/apis/edit'
import { message } from 'ant-design-vue'
import ColorPicker from './components/colorPicker/index.vue'
import MyInput from './components/input/index.vue'

const components = ref<EditComponent[]>([])

const borderStyleOptions = [
    {
        value: 'none',
        label: '无边框'
    }, {
        value: 'solid',
        label: '实线'
    }, {
        value: 'dotted',
        label: '圆点'
    }, {
        value: 'dashed',
        label: '虚线'
    }, {
        value: 'double',
        label: '双实线'
    }, {
        value: 'groove',
        label: '雕刻效果'
    }, {
        value: 'ridge',
        label: '浮雕效果'
    }
]

const inputTypeOptions = [
    {
        value: 'text',
        label: '文字'
    }, {
        value: 'number',
        label: '数字'
    }, {
        value: 'tel',
        label: '电话'
    }
]

const linkTargetOptions = [
    {
        value: '_blank',
        label: '新窗口'
    }, {
        value: '_self',
        label: '当前页面'
    }
]

type UseComponent = ReturnType<typeof useComponent>

type UseDrag = ReturnType<typeof useDrag>

type UseCanvas = ReturnType<typeof useCanvasPanel>

// component
function useComponent () {
    const uid = computed(() => {
        const lastComponent = components.value[components.value.length - 1]

        if (!lastComponent) return 1

        return lastComponent.id + 1
    })

    function render (item: ImportComponent) {
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

    function add (item: ImportComponent) {
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
    let dragItem: null | ImportComponent = null

    function start (item: ImportComponent) {
        dragItem = item
    }

    function end (e: DragEvent) {
        if (!dragItem) {
            return
        }

        const c = component.add(dragItem)
        c.props.top = e.offsetY - c.props.height / 2
        c.props.left = e.offsetX - c.props.width / 2

        selectComponentId.value = c.id
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

        editComponent.props.top += nowTop - initTop
        editComponent.props.left += nowLeft - initLeft

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

const selectComponentId = ref<number>()

const selectComponent = computed<EditComponent | undefined>(() => {
    return components.value.filter(a => a.id === selectComponentId.value)[0]
})

function useSelect (component: UseComponent, drag: UseDrag) {
    function select (e: MouseEvent, component: EditComponent) {
        selectComponentId.value = component.id
        drag.moveStart(e, component)
    }

    function noSelect () {
        selectComponentId.value = undefined
    }

    const selectProps = computed(() => {
        if (!selectComponent.value) return

        return selectComponent.value.props
    })

    function selectStyle (item: EditComponent) {
        const props = item.props

        const res = {
            opacity: 1,
            zIndex: props.zIndex,
            position: 'absolute',
            width: `${props.width}px`,
            height: `${props.height}px`,
            top: `${props.top}px`,
            left: `${props.left}px`,
            transform: `rotate(${props.rotate}deg)`
        }

        if (selectComponentId.value !== item.id) {
            res.opacity = 0
        }

        return res
    }

    return reactive({
        selectStyle,
        select,
        noSelect,
        selectProps,
        selectComponent,
        keydown (e: KeyboardEvent) {
            if (isRestoreKeydown(e) || isRevokeKeydown(e)) {
                skipPushWithdrawal.value = true
            }
        }
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

    return {
        saveData
    }
}

// 属性面板相关
function usePropPanel () {
    const name = computed(() => {
        return String(selectComponent.value?.name)
    })

    const showFont = computed(() => {
        return [componentNames.text, componentNames.input, componentNames.button, componentNames.link].includes(name.value)
    })

    const showImage = computed(() => {
        return [componentNames.image].includes(name.value)
    })

    const showInput = computed(() => {
        return [componentNames.input].includes(name.value)
    })

    const showButton = computed(() => {
        return [componentNames.button].includes(name.value)
    })

    const showLink = computed(() => {
        return [componentNames.link].includes(name.value)
    })

    const showComponentProps = computed(() => {
        return [componentNames.image, componentNames.input, componentNames.button, componentNames.link].includes(name.value)
    })

    return reactive({
        showFont,
        showImage,
        showInput,
        showButton,
        showLink,
        showComponentProps
    })
}

// 回撤
function useWithdrawal () {
    const withdrawal = createWithdrawal<EditComponent[]>()
    registerWindowKeyDown(withdrawal.registerKeydown)

    function watchComponents () {
        watch(components, () => {
            withdrawal.push(cloneDeep(components.value))
        }, {
            deep: true
        })

        function update (data: EditComponent[]) {
            components.value = cloneDeep(data)

            skipPushWithdrawal.value = true
        }

        withdrawal.onRevoke(update)
        withdrawal.onRestore(update)
    }

    watchComponents()
}

function useSaveKeydown (e: KeyboardEvent, canvas: UseCanvas) {
    if (isSaveKeydown(e)) {
        e.preventDefault()

        canvas.saveData()
    }
}

function useDelKeydown (e: KeyboardEvent, component: UseComponent) {
    if (!selectComponent.value) {
        return
    }

    const key = e.key.toLowerCase()
    const isDel = key === 'delete'

    if (isDel) {
        component.remove(selectComponent.value)
    }
}

function useArrowKeydown (e: KeyboardEvent) {
    if (!selectComponent.value) {
        return
    }

    const key = e.key.toLowerCase()
    const isArrowUp = key === 'arrowup'
    const isArrowDown = key === 'arrowdown'
    const isArrowLeft = key === 'arrowleft'
    const isArrowRight = key === 'arrowright'

    let value = 1

    if (e.shiftKey) {
        value = 10
    }

    const props = selectComponent.value.props

    if (isArrowUp) {
        props.top -= value
    } else if (isArrowDown) {
        props.top += value
    } else if (isArrowLeft) {
        props.left -= value
    } else if (isArrowRight) {
        props.left += value
    }
}

export default defineComponent({
    components: {
        ...importComponents,
        ColorPicker,
        MyInput
    },

    setup () {
        const component = useComponent()
        const canvasPanel = useCanvasPanel()
        const drag = useDrag(component)
        const select = useSelect(component, drag)
        const propPanel = usePropPanel()

        useWithdrawal()

        registerWindowKeyDown(useArrowKeydown)
        registerWindowKeyDown((e) => {
            useSaveKeydown(e, canvasPanel)
        })
        registerWindowKeyDown((e) => {
            useDelKeydown(e, component)
        })

        return {
            drag,
            select,
            propPanel,
            components,
            componentList,
            save: canvasPanel.saveData,
            borderStyleOptions,
            inputTypeOptions,
            linkTargetOptions
        }
    }
})
