import { MyComponentConfig, MyProps, PropValue, BasePropsType, Image } from 'qm-lowCode-component'
import { useDebounce } from '@/utils'
import { reactive } from 'vue'

// eslint-disable-next-line
export const componentList: MyComponentConfig[] = [Image] as any

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
    return {
        position: 'absolute',
        left: `${props.left.value}px`,
        top: `${props.top.value}px`,
        width: `${props.width.value}px`,
        height: `${props.height.value}px`,
        color: props.color.value,
        backgroundColor: props.backgroundColor.value,
        fontSize: `${props.fontSize.value}px`,
        fontWeight: props.fontWeight.value,
        borderRadius: `${props.borderRadius.value}px`,
        borderColor: props.borderColor.value,
        borderWidth: `${props.borderWidth.value}px`,
        borderStyle: props.borderStyle.value
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
