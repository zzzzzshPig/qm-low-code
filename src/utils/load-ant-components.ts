import { App } from 'vue'
import { Button, Input } from 'ant-design-vue'

const components = [Input, Button]

export default (app: App<Element>) => {
    components.forEach(a => {
        app.use(a)
    })

    return app
}
