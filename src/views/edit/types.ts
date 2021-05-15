import { MyComponentConfig, GetPropsType, MyProps } from 'qm-lowCode-component'

export type MyParams<T> = GetPropsType<MyProps<T>>

export type EditComponent = {
    name: MyComponentConfig['name']
    id: number
    props: MyParams<unknown>
    select: boolean
}
