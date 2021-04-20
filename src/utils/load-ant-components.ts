import { App } from 'vue'
import { Button, Input, InputNumber } from 'ant-design-vue'

const components = [Input, Button, InputNumber]

export default (app: App<Element>) => {
    components.forEach(a => {
        app.use(a)
    })

    return app
}
