import { defineComponent, ref, watch } from 'vue'

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

        watch(modelValue, (n, o) => {
            const res = Number(n)

            modelValue.value = Number.isNaN(res) ? Number(o) : res

            ctx.emit('update:value', modelValue.value)
        })

        return {
            modelValue
        }
    }
})
