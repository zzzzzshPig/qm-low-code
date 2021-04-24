import Image from './components/image/index.vue'
import { MyComponentConfig } from '@/views/edit/components/helper'
import { GetPropsType, MyProps, PropValue } from '@/views/edit/components/type'
import { onUnmounted } from 'vue'

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

enum ActionType {
    Revoke,
    Restore,
}
type QueueItem = (action: ActionType) => void

export function createWithdrawal () {
    // 指针
    const queue: Array<QueueItem> = []
    const depth = 100
    const delay = 1000
    let time = 0
    let step = -1

    function registerKey (e: KeyboardEvent) {
        const isZ = e.key === 'z'

        if (e.metaKey && isZ) {
            call(!e.shiftKey ? ActionType.Revoke : ActionType.Restore)
        }
    }

    // 初始化快捷键
    window.addEventListener('keydown', registerKey)
    onUnmounted(() => {
        window.removeEventListener('keydown', registerKey)
    })

    function call (action: ActionType) {
        if (!queue[step]) return

        if (action === ActionType.Revoke) {
            queue[step](action)
            step -= 1
        } else if (action === ActionType.Restore) {
            step += 1
            queue[step](action)
        }

        if (step < 0 || step > queue.length) {
            step = Math.min(Math.max(0, step), queue.length)
        }
    }

    // 保存撤销和回撤的回调
    function push (cb: QueueItem) {
        const now = Date.now()

        // 连续触发 不监听
        if (now - time <= delay) {
            time = now
            return
        }

        // 超出最大深度
        if (queue.length > depth) {
            queue.shift()
        }

        // 撤销之后 新修改了值
        if (step < queue.length) {
            queue.splice(step)
        }

        step++
        queue.push(cb)
    }

    return {
        push,
        ActionType
    }
}
