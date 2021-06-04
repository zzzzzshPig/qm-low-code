import { defineComponent, ref } from 'vue'
import { ColorPicker } from 'vue-color-kit'
import 'vue-color-kit/dist/vue-color-kit.css'

export default defineComponent({
    components: {
        ColorPicker
    },
    props: {
        value: {
            type: String,
            default: ''
        }
    },
    emits: ['update:value'],
    setup (props, ctx) {
        const node = ref(null)

        return {
            node,
            change ({ rgba: { a, b, g, r } }: never) {
                ctx.emit('update:value', `rgba(${r}, ${g}, ${b}, ${a})`)
            },
            getPopupContainer () {
                const dom = node.value as never as HTMLElement

                if (!dom) {
                    return
                }

                return dom.parentNode
            }
        }
    }
})
