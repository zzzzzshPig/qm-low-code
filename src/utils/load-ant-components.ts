import { App } from 'vue'
import { Button, Input, InputNumber, Select, Popover, Checkbox } from 'ant-design-vue'

const components = [Input, Button, InputNumber, Select, Popover, Checkbox]

export default (app: App<Element>) => {
    components.forEach(a => {
        app.use(a)
    })

    return app
}
