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

type QueueItem = () => void

export function createWithdrawal () {
    const queue: Array<{
        revoke: QueueItem
        restore: QueueItem
    }> = []
    // 保存记录的最大深度
    const depth = 100
    // 保存间隔时长
    const delay = 1000
    let time = 0
    // 指针
    let step = 0

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
    onUnmounted(() => {
        window.removeEventListener('keydown', registerKey)
    })

    function callRevoke () {
        if (step <= 0) {
            step = 0
            return
        }

        step--
        queue[step].revoke()
    }

    function callRestore () {
        if (step >= queue.length) {
            return
        }

        queue[step].restore()
        step++
    }

    // 保存撤销的回调
    function push (revoke: QueueItem, restore: QueueItem) {
        const now = Date.now()

        // 连续触发 不监听
        if (now - time <= delay) {
            time = now
            return
        }
        time = now

        // 超出最大深度
        if (queue.length > depth) {
            queue.shift()
        }

        // 撤销之后 新修改了值
        if (step < queue.length) {
            queue.splice(step)
        }

        step++
        queue.push({
            revoke,
            // 站位
            restore
        })
    }

    return {
        push
    }
}
