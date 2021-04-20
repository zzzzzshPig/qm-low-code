import { ParamType } from '@/views/edit/components/helper'
import { DefineComponent } from 'vue'

export type MyParams = {
    [index: string]: {
        label: string
        type: ParamType,
        value: string | number | boolean
    }
}
