import { App } from 'vue'
import { Button } from 'ant-design-vue'

export default (app: App<Element>) => {
    app.use(Button)

    return app
}
