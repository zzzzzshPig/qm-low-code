import { ParamType } from '@/views/edit/components/helper'
import { DefineComponent } from 'vue'

export type MyParams = {
    [k: string]: {
        label: string
        type: ParamType,
        value: string | number | boolean
    }
}

// eslint-disable-next-line
export type VueComponent = DefineComponent<{}, {}, any>
