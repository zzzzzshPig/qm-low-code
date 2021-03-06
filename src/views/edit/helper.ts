import { Block, Input, Button, Link, Image, Text } from 'qm-low-code-component'
import { useDebounce } from '@/utils'
import { reactive, onUnmounted } from 'vue'
import { BasePropTypeKeys, ComponentListItem, EditComponent, ImportComponent, PropValueType } from './types'
import imageSvg from './images/image.svg'
import textSvg from './images/text.svg'
import blockSvg from './images/block.svg'
import inputSvg from './images/input.svg'
import buttonSvg from './images/button.svg'
import linkSvg from './images/link.svg'

export const componentNames = {
    image: Image.name,
    text: Text.name,
    block: Block.name,
    input: Input.name,
    button: Button.name,
    link: Link.name
}

export const importComponents = {
    [componentNames.image]: Image,
    [componentNames.text]: Text,
    [componentNames.block]: Block,
    [componentNames.input]: Input,
    [componentNames.button]: Button,
    [componentNames.link]: Link
}

export const componentList: ComponentListItem[] = [
    {
        name: componentNames.image,
        label: '图片',
        image: imageSvg,
        props: Image.props
    }, {
        name: componentNames.text,
        label: '文本',
        image: textSvg,
        props: Text.props
    }, {
        name: componentNames.block,
        label: '块',
        image: blockSvg,
        props: Block.props
    }, {
        name: componentNames.input,
        label: '输入框',
        image: inputSvg,
        props: Input.props
    }, {
        name: componentNames.button,
        label: '按钮',
        image: buttonSvg,
        props: Button.props
    }, {
        name: componentNames.link,
        label: '超链接',
        image: linkSvg,
        props: Link.props
    }
]

export function openWin (url: string, target: string) {
    const a = document.createElement('a')
    const id = '___false_click'

    a.setAttribute('href', url)
    a.setAttribute('target', target)
    a.setAttribute('id', id)

    // 防止反复添加
    if (!document.getElementById(id)) {
        document.body.appendChild(a)
    }

    a.click()
}

export function registerWindowKeyDown (cb: (e: KeyboardEvent, ...arg: never[]) => void) {
    window.addEventListener('keydown', cb)
    onUnmounted(() => {
        window.removeEventListener('keydown', cb)
    })
}

const isMacOs = navigator.platform.toLowerCase().includes('mac')

function getMetaKey (e: KeyboardEvent) {
    return isMacOs ? e.metaKey : e.ctrlKey
}

export function isSaveKeydown (e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    const handler = getMetaKey(e)

    return handler && key === 's'
}

export function isRevokeKeydown (e: KeyboardEvent) {
    const handler = getMetaKey(e)

    return handler && e.key.toLowerCase() === 'z'
}

export function isRestoreKeydown (e: KeyboardEvent) {
    const handler = getMetaKey(e)

    return handler && e.key.toLowerCase() === 'z' && e.shiftKey
}

export function isCopyKeydown (e: KeyboardEvent) {
    const handler = getMetaKey(e)

    return handler && e.key.toLowerCase() === 'c'
}

export function isPasteKeydown (e: KeyboardEvent) {
    const handler = getMetaKey(e)

    return handler && e.key.toLowerCase() === 'v'
}

export function initProps (component: ImportComponent) {
    return reactive(convertProps(component.props))
}

function convertProps (props: ImportComponent['props']) {
    const res = new Map<BasePropTypeKeys, PropValueType>()
    const keys = Reflect.ownKeys(props) as BasePropTypeKeys[]

    keys.forEach(a => {
        const prop = props[a]
        res.set(a, prop.default)
    })

    return Object.fromEntries(res.entries()) as EditComponent['props']
}

export const skipPushWithdrawal = {
    value: false
}

// 撤销与回撤功能
export function createWithdrawal<T> () {
    const queue: Array<T> = []
    // 保存记录的最大深度
    const depth = 100
    // 保存间隔时长
    const delay = 300
    // 指针
    let step = 0

    function registerKeydown (e: KeyboardEvent) {
        if (isRestoreKeydown(e)) {
            console.log('callRestore')
            callRestore()
        } else if (isRevokeKeydown(e)) {
            console.log('callRevoke')
            callRevoke()
        }
    }

    let onRevokeCb: (data: T) => void = () => undefined

    function onRevoke (fn = onRevokeCb) {
        onRevokeCb = fn
    }

    let onRestoreCb: (data: T) => void = () => undefined

    function onRestore (fn = onRestoreCb) {
        onRestoreCb = fn
    }

    function callRevoke () {
        if (step <= 1) {
            return
        }

        step--
        onRevokeCb(queue[step - 1])
        console.log(step)
    }

    function callRestore () {
        if (step >= queue.length) {
            return
        }

        onRestoreCb(queue[step])
        step++
        console.log(step)
    }

    // 保存撤销的回调
    const debounce = useDebounce()
    function push (data: T, customDelay = delay) {
        if (skipPushWithdrawal.value) {
            skipPushWithdrawal.value = false
            return
        }

        debounce.apply(() => {
            // 超出最大深度
            if (queue.length > depth) {
                queue.shift()
            }

            // 撤销之后又修改内容，撤销点后的原有内容舍弃
            queue.length = step

            step++

            queue.push(data)

            console.log(step)
        }, customDelay)
    }

    return {
        push,
        onRestore,
        onRevoke,
        registerKeydown
    }
}
