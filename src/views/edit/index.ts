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
    isRevokeKeydown,
    openWin, isCopyKeydown, isPasteKeydown
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

function getCanvasDom () {
    const canvas = document.querySelector('.canvas') as HTMLDivElement | null

    if (!canvas) {
        return {
            canvas: canvas,
            boundClientRect: null
        }
    }

    return {
        canvas,
        boundClientRect: canvas.getBoundingClientRect()
    }
}

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
        uid,
        add,
        remove,
        insert
    }
}

function useDrag (component: UseComponent) {
    let dragItem: null | ImportComponent = null

    const maxZIndex = computed(() => {
        let res = -Infinity

        for (const a of components.value) {
            if (a.props.zIndex > res) {
                res = a.props.zIndex
            }
        }

        return res
    })

    function start (item: ImportComponent) {
        dragItem = item
    }

    function end (e: DragEvent) {
        if (!dragItem) {
            return
        }

        const { canvas, boundClientRect } = getCanvasDom()

        if (!boundClientRect || !canvas) {
            return
        }

        const c = component.add(dragItem)

        c.props.top = e.clientY - boundClientRect.top + canvas.scrollTop - c.props.height / 2
        c.props.left = e.clientX - boundClientRect.left - c.props.width / 2
        c.props.zIndex = maxZIndex.value + 1
    }

    function restore () {
        dragItem = null
    }

    let initTop = 0
    let initLeft = 0
    let delayTime = 0

    function moveStart (e: MouseEvent) {
        if (e.button !== 0) {
            return
        }

        initTop = e.clientY
        initLeft = e.clientX
        delayTime = Date.now()

        document.addEventListener('mouseup', moveEnd)
        document.addEventListener('mousemove', move)
    }

    function move (e: MouseEvent) {
        // 短时间start - move无效
        if (Date.now() - delayTime < 100) {
            return
        }

        const nowTop = e.clientY
        const nowLeft = e.clientX

        selectComponent.value.forEach(a => {
            a.props.top += nowTop - initTop
            a.props.left += nowLeft - initLeft
        })

        initTop = nowTop
        initLeft = nowLeft
    }

    function moveEnd () {
        document.removeEventListener('mouseup', moveEnd)
        document.removeEventListener('mousemove', move)
    }

    return {
        start,
        end,
        restore,
        moveStart
    }
}

function useScale () {
    function scale (e: MouseEvent, vector: Array<1 | -1 | 0>) {
        let sX = e.clientX
        let sY = e.clientY
        const canTop = vector[0]
        const canLeft = vector[1]
        const canWidth = vector[2]
        const canHeight = vector[3]

        function mousemove (e: MouseEvent) {
            const nX = e.clientX
            const nY = e.clientY

            selectComponent.value.forEach(a => {
                const props = a.props
                const sTop = props.top
                const sLeft = props.left
                const sWidth = props.width
                const sHeight = props.height

                if (canWidth) {
                    props.width = Math.max(0, sWidth + (nX - sX) * canWidth)
                }

                if (canHeight) {
                    props.height = Math.max(0, sHeight + (nY - sY) * canHeight)
                }

                if (canTop) {
                    props.top = sTop + nY - sY
                    props.top = canTop ? Math.min(props.top, sTop + sHeight) : Math.max(props.top, sTop)
                }

                if (canLeft) {
                    props.left = sLeft + nX - sX
                    props.left = canLeft ? Math.min(props.left, sLeft + sWidth) : Math.max(props.left, sLeft)
                }
            })

            sX = nX
            sY = nY
        }

        function mouseup () {
            document.removeEventListener('mousemove', mousemove)
            document.removeEventListener('mouseup', mouseup)
        }

        document.addEventListener('mousemove', mousemove)

        document.addEventListener('mouseup', mouseup)
    }

    return {
        scale
    }
}

const selectComponent = ref<EditComponent[]>([])

let notNoSelect = false

function useSelect (component: UseComponent, drag: UseDrag) {
    function select (e: MouseEvent, component: EditComponent) {
        selectComponent.value = [component]

        notNoSelect = true

        drag.moveStart(e)
    }

    function noSelect () {
        if (notNoSelect) {
            notNoSelect = false
            return
        }

        selectComponent.value = []
    }

    const selectProps = computed(() => {
        if (!selectComponent.value.length || selectComponent.value.length > 1) return

        return selectComponent.value[0].props
    })

    const checkBoxStyle = reactive({
        width: 0,
        height: 0,
        top: 0,
        left: 0
    })

    const componentStyle = reactive({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        zIndex: 0
    })

    function drawCheckBox (e: MouseEvent) {
        if (e.button !== 0) {
            return
        }

        const sX = e.pageX
        const sY = e.pageY
        const sTop = sY
        const sLeft = sX
        const { boundClientRect } = getCanvasDom()

        function mousemove (e: MouseEvent) {
            if (!boundClientRect) {
                return
            }

            checkBoxStyle.top = e.clientY - sY > 0 ? sTop : sTop + e.clientY - sY
            checkBoxStyle.left = e.clientX - sX > 0 ? sLeft : sLeft + e.clientX - sX
            checkBoxStyle.width = Math.abs(sX - e.clientX)
            checkBoxStyle.height = Math.abs(sY - e.clientY)

            selectComponent.value = components.value.filter(a => {
                let { left, top, width, height } = a.props
                left += boundClientRect.x
                top += boundClientRect.y

                // 右侧大于左侧 左侧小于右侧 顶部小于底部 底部大于顶部
                if ((checkBoxStyle.left + checkBoxStyle.width) > left && checkBoxStyle.left < (left + width) && checkBoxStyle.top < (top + height) && (checkBoxStyle.top + checkBoxStyle.height) > top) {
                    return a
                }
            })

            notNoSelect = true
        }

        function mouseup () {
            checkBoxStyle.width = 0
            checkBoxStyle.height = 0
            checkBoxStyle.top = 0
            checkBoxStyle.left = 0

            document.removeEventListener('mouseup', mouseup)
            document.removeEventListener('mousemove', mousemove)
        }

        document.addEventListener('mousemove', mousemove)
        document.addEventListener('mouseup', mouseup)
    }

    return reactive({
        select,
        noSelect,
        selectProps,
        selectComponent,
        keydown (e: KeyboardEvent) {
            if (isRestoreKeydown(e) || isRevokeKeydown(e)) {
                skipPushWithdrawal.value = true
            }
        },
        drawCheckBox,
        checkBoxStyle: computed(() => {
            return {
                width: checkBoxStyle.width + 'px',
                height: checkBoxStyle.height + 'px',
                top: checkBoxStyle.top + 'px',
                left: checkBoxStyle.left + 'px'
            }
        }),
        boxStyle: computed(() => {
            const { boundClientRect } = getCanvasDom()

            if (!selectComponent.value || !boundClientRect) {
                return
            }

            componentStyle.top = Infinity
            componentStyle.left = Infinity
            componentStyle.width = -Infinity
            componentStyle.height = -Infinity
            componentStyle.zIndex = -Infinity

            selectComponent.value.forEach(a => {
                componentStyle.top = Math.min(a.props.top, componentStyle.top)
                componentStyle.left = Math.min(a.props.left, componentStyle.left)
                componentStyle.width = Math.max(a.props.left + a.props.width, componentStyle.width)
                componentStyle.height = Math.max(a.props.top + a.props.height, componentStyle.height)
                componentStyle.zIndex = Math.max(a.props.zIndex, componentStyle.zIndex)
            })

            return {
                zIndex: componentStyle.zIndex,
                top: componentStyle.top + boundClientRect.top + 'px',
                left: componentStyle.left + boundClientRect.left + 'px',
                width: componentStyle.width - componentStyle.left + 'px',
                height: componentStyle.height - componentStyle.top + 'px'
            }
        })
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
        return String(selectComponent.value[0].name)
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
            selectComponent.value = []

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
    const key = e.key.toLowerCase()
    const isDel = key === 'delete'

    if (isDel) {
        while (selectComponent.value.length) {
            const v = selectComponent.value.pop()

            if (v) {
                component.remove(v)
            }
        }
    }
}

function useArrowKeydown (e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    const isArrowUp = key === 'arrowup'
    const isArrowDown = key === 'arrowdown'
    const isArrowLeft = key === 'arrowleft'
    const isArrowRight = key === 'arrowright'

    let value = 1

    if (e.shiftKey) {
        value = 10
    }

    selectComponent.value.forEach(a => {
        const props = a.props

        if (isArrowUp) {
            props.top -= value
        } else if (isArrowDown) {
            props.top += value
        } else if (isArrowLeft) {
            props.left -= value
        } else if (isArrowRight) {
            props.left += value
        }
    })
}

let copyComponent = '[]'
function useCopyPasteKeydown (e: KeyboardEvent, component: UseComponent) {
    if (isCopyKeydown(e)) {
        if (!selectComponent.value.length) {
            return
        }

        copyComponent = JSON.stringify(selectComponent.value)
    }

    if (isPasteKeydown(e)) {
        const components = JSON.parse(copyComponent) as EditComponent[]
        const fComponents: EditComponent[] = []

        components.forEach(a => {
            const com = {
                ...a,
                id: component.uid.value
            }
            fComponents.push(com)
            component.insert(com)
        })

        selectComponent.value = fComponents
    }
}

function useAction (canvas: UseCanvas) {
    const route = useRoute()

    function save () {
        return canvas.saveData()
    }

    async function preview () {
        await save()

        setTimeout(() => {
            openWin(`http://192.168.1.66/market_activity_dev/${route.params.id}`, '_blank')
        }, 1000)
    }

    function publish () {
        console.log('1')
    }

    async function prepublish () {
        await save()

        setTimeout(() => {
            openWin(`http://192.168.1.66/market_activity_staging/${route.params.id}`, '_blank')
        }, 1000)
    }

    return {
        save,
        preview,
        publish,
        prepublish
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

        registerWindowKeyDown(e => {
            useDelKeydown(e, component)
            useSaveKeydown(e, canvasPanel)
            useArrowKeydown(e)
            useCopyPasteKeydown(e, component)
        })

        return {
            drag,
            select,
            propPanel,
            components,
            componentList,
            borderStyleOptions,
            inputTypeOptions,
            linkTargetOptions,
            action: useAction(canvasPanel),
            scale: useScale()
        }
    }
})
