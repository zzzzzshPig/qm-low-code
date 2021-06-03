import { defineComponent, ref, watchEffect } from 'vue'

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
            }
        }
    }
})
