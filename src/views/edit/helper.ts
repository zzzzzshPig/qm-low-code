import { MyComponentConfig, MyProps, PropValue, BasePropsType, Image, Text } from 'qm-lowCode-component'
import { useDebounce } from '@/utils'
import { onUnmounted, reactive } from 'vue'

export function divisionNumberOrString (...args: Array<number | string>) {
    let res = parseInt(args[0].toString())

    args.shift()

    args.forEach(a => {
        res /= parseInt(a.toString())
    })

    return res
}

export function reduceNumberOrString (...args: Array<number | string>) {
    let res = parseInt(args[0].toString())

    args.shift()

    args.forEach(a => {
        res -= parseInt(a.toString())
    })

    return res
}

export function addNumberOrString (...args: Array<number | string>) {
    let res = 0

    args.forEach(a => {
        res += parseInt(a.toString())
    })

    return res
}

export function numberToString (num: number, unit = 'px') {
    return num + unit
}

// eslint-disable-next-line
export const componentList: MyComponentConfig[] = [Image, Text] as any

export function initProps (component: MyComponentConfig) {
    return reactive(convertProps(component.props)) as BasePropsType
}

function convertProps<T extends MyProps<T>> (props: T) {
    const res = new Map<keyof T, PropValue>()
    const keys = Reflect.ownKeys(props) as (keyof T)[]

    keys.forEach(a => {
        const prop = props[a]
        res.set(a, prop.default())
    })

    return Object.fromEntries(res.entries()) as BasePropsType
}

// 生成传入组件的基础props
export function initComponentStyle (props: BasePropsType) {
    const keys = Reflect.ownKeys(props) as (keyof BasePropsType)[]
    const res: Record<keyof BasePropsType, unknown> = {} as never

    keys.forEach(a => {
        res[a] = props[a].value
    })

    return {
        position: 'absolute',
        ...res
    }
}

export function registerKeydownEvent (fn: (e: KeyboardEvent) => void) {
    window.addEventListener('keydown', fn)

    onUnmounted(() => {
        window.removeEventListener('keydown', fn)
    })
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

    function registerKey (e: KeyboardEvent) {
        const isZ = e.key.toLowerCase() === 'z'

        if (e.metaKey && isZ) {
            e.preventDefault()

            if (e.shiftKey) {
                console.log('callRestore')
                callRestore()
            } else {
                console.log('callRevoke')
                callRevoke()
            }
        }
    }

    registerKeydownEvent(registerKey)

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
        onRevoke
    }
}
