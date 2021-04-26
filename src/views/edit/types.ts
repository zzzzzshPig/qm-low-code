import { MyComponentConfig } from '@/views/edit/components/helper'
import { MyParams } from '@/views/edit/components/type'

export type EditComponent = {
    name: MyComponentConfig['name']
    id: number
    props: MyParams<unknown>
    style: Record<string, string>
    event: Record<string, () => void>
}