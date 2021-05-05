import Image from './components/image/index.vue'
import { MyComponentConfig } from '@/views/edit/components/helper'
import { GetPropsType, MyProps, PropValue } from '@/views/edit/components/type'
import { useDebounce } from '@/utils'

// eslint-disable-next-line
export const componentList: MyComponentConfig[] = [Image] as any

export function convertProps<T extends MyProps<T>> (props: T) {
    const res = new Map<keyof T, PropValue>()
    const keys = Reflect.ownKeys(props) as (keyof T)[]

    keys.forEach(a => {
        const prop = props[a]
        res.set(a, prop.default())
    })

    return Object.fromEntries(res.entries()) as GetPropsType<T>
}

export function createWithdrawal<T> () {
    const queue: Array<T> = []
    // 保存记录的最大深度
    const depth = 100
    // 保存间隔时长
    const delay = 300
    // 指针
    let step = -1

    function registerKey (e: KeyboardEvent) {
        const isZ = e.key === 'z'

        if (e.metaKey && isZ) {
            if (e.shiftKey) {
                callRestore()
            } else {
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
        if (step <= 0) {
            return
        }

        step--
        onRevokeCb(queue[step])
    }

    function callRestore () {
        if (step >= queue.length - 1) {
            return
        }

        step++
        onRestoreCb(queue[step])
    }

    // 保存撤销的回调
    const debounce = useDebounce()
    function push (data: T, customDelay = delay) {
        debounce.apply(() => {
            // 超出最大深度
            if (queue.length > depth) {
                queue.shift()
            }

            // 撤销之后 新修改了值
            if (step < queue.length - 1) {
                queue.splice(step + 1)
            }

            step++
            queue.push(data)
            console.log(queue)
        }, customDelay)
    }

    return {
        push,
        destroy,
        onRestore,
        onRevoke
    }
}
