import Image from './components/image/index.vue'
import { MyComponentConfig } from '@/views/edit/components/helper'
import { GetPropsType, MyProps, PropValue } from '@/views/edit/components/type'

// eslint-disable-next-line
export const componentList: MyComponentConfig[] = [Image] as any

export function getComponentById (id: MyComponentConfig['componentId']) {
    return componentList.filter(a => a.componentId === id)[0] || null
}

export function convertProps<T extends MyProps<T>> (props: T) {
    const res = new Map<keyof T, PropValue>()
    const keys = Reflect.ownKeys(props) as (keyof T)[]

    keys.forEach(a => {
        const prop = props[a]
        res.set(a, prop.default())
    })

    return Object.fromEntries(res.entries()) as GetPropsType<T>
}
