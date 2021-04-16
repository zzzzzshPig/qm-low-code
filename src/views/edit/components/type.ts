import { QueryType } from '@/views/edit/components/helper'

export type MyParams = {
    [key: string]: {
        label: string
        type: QueryType,
        value: string | number | boolean
    }
}
