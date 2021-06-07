import { App } from 'vue'
import { Button, Input, Select, Popover, Checkbox } from 'ant-design-vue'

const components = [Input, Button, Select, Popover, Checkbox]

export default (app: App<Element>) => {
    components.forEach(a => {
        app.use(a)
    })

    return app
}
