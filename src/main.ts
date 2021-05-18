import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loadAntComponent from '@/utils/load-ant-components'

const app = createApp(App)

app.use(store)
    .use(router)

loadAntComponent(app)

app.mount('#app')
