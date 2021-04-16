import { defineComponent, createApp, h, DefineComponent } from 'vue'
import Image from './components/image/export'

const classId = 0

function renderComponent (component: DefineComponent) {
    const container = document.createElement('div')
    container.className = `_container_class_${classId}`

    return createApp({
        render () {
            return h(component)
        }
    }).mount(container)
}

const components = [Image]
function loadComponent () {
    return components.map(a => {
        return {
            ...a,
            params: a.params
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
