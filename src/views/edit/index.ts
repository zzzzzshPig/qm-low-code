import { defineComponent, createApp, h, DefineComponent } from 'vue'
import Image from './components/image/export'

const classId = 0

function renderComponent (component: DefineComponent) {
    const container = document.createElement('div')
    container.className = `_container_class_${classId}`

    // need renderId
    return createApp({
        render () {
            return h(component)
        }
    }).mount(container)
}

const componentList = [Image]

export default defineComponent({
    setup () {
        console.log(componentList)
        return {
            componentList
        }
    }
})
