import { App } from 'vue'
import { Button, Input, InputNumber, Select, Popover } from 'ant-design-vue'

const components = [Input, Button, InputNumber, Select, Popover]

export default (app: App<Element>) => {
    components.forEach(a => {
        app.use(a)
    })

    return app
}
