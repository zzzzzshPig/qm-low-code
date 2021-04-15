import { defineComponent, createApp, ref, reactive, h, DefineComponent } from 'vue'
import Image from './components/image/export'

const classId = 0

function generateComponent (component: DefineComponent, props: Record<string, unknown>) {
    props = reactive(props)

    const container = document.createElement('div')
    container.className = `_container_class_${classId}`

    return createApp({
        render () {
            return h(component, props)
        }
    }).mount(container)
}

function normalizeProps (props: Record<string, any>) {
    const res: typeof props = {}
    const keys = Reflect.ownKeys(props) as string[]

    for (const k of keys) {
        res[k] = undefined
    }

    return res
}

const components = [Image]
function loadComponent () {
    return components.map(a => {
        return {
            ...a,
            props: normalizeProps(a.vue.props)
        }
    })
}

export default defineComponent({
    setup () {
        const componentList = loadComponent()

        console.log(componentList)
        return {
            componentList
        }
    }
})
