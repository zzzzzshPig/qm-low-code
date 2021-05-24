import { defineComponent, ref, watch, computed, reactive } from 'vue'
import {
    importComponents,
    createWithdrawal,
    initProps,
    isSaveKeydown, componentList
} from './helper'
import { EditComponent, ImportComponent } from '@/views/edit/types'
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

    function registerKeydown (e: KeyboardEvent) {
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
            props.top -= value
        } else if (isArrowDown) {
            props.top += value
        } else if (isArrowLeft) {
            props.left -= value
        } else if (isArrowRight) {
            props.left += value
        } else if (isDel) {
            component.remove(selectComponent.value)
        }
    }

    return reactive({
        select,
        noSelect,
        selectComponent,
        registerKeydown
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

    function registerKeydown (e: KeyboardEvent) {
        if (isSaveKeydown(e)) {
            e.preventDefault()
            saveData()
        }
    }

    return {
        saveData,
        registerKeydown
    }
}

// colorPicker
function useColorPicker () {
//
}

// 属性面板相关
function usePropPanel () {
//
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

export default defineComponent({
    components: {
        ...importComponents,
        ColorPicker
    },

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
            save: canvasPanel.saveData
        }
    }
})
