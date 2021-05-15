import { MyComponentConfig, MyProps, PropValue, BasePropsType, Image } from 'qm-lowCode-component'
import { useDebounce } from '@/utils'
import { reactive } from 'vue'
import { MyParams } from '@/views/edit/types'

// eslint-disable-next-line
export const componentList: MyComponentConfig[] = [Image] as any

export function initProps<T extends MyProps<T>> (component: MyComponentConfig<T>) {
    return reactive(convertProps(component.props))
}

function convertProps<T extends MyProps<T>> (props: T) {
    const res = new Map<keyof T, PropValue>()
    const keys = Reflect.ownKeys(props) as (keyof T)[]

    keys.forEach(a => {
        const prop = props[a]
        res.set(a, prop.default())
    })

    return Object.fromEntries(res.entries()) as MyParams<T>
}

// 生成传入组件的基础props
export function initComponentStyle (params: MyParams<BasePropsType>) {
    return {
        position: 'absolute',
        left: `${params.x.value}px`,
        top: `${params.y.value}px`,
        width: `${params.width.value}px`,
        height: `${params.height.value}px`
    }
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
        const isZ = e.key === 'z'

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

    // 初始化快捷键
    window.addEventListener('keydown', registerKey)

    function destroy () {
        window.removeEventListener('keydown', registerKey)
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
        destroy,
        onRestore,
        onRevoke
    }
}
