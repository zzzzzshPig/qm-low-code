import { defineComponent, ref, watchEffect } from 'vue'
import { isRestoreKeydown, isRevokeKeydown, skipPushWithdrawal } from '@/views/edit/helper'

export default defineComponent({
    props: {
        value: {
            type: Number,
            default: 0
        }
    },
    emits: ['update:value'],
    setup (props, ctx) {
        const modelValue = ref(props.value)

        watchEffect(() => {
            modelValue.value = props.value
        })

        return {
            modelValue,
            change () {
                const value = Number(modelValue.value)

                if (Number.isNaN(value)) {
                    return
                }

                ctx.emit('update:value', value)
            },
            keydown (e: KeyboardEvent) {
                if (isRestoreKeydown(e) || isRevokeKeydown(e)) {
                    skipPushWithdrawal.value = true
                }
            }
        }
    }
})
