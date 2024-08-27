// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import VueGtag from "vue-gtag";

const app = createApp(App)

app.use(createPinia())
app.use(VueGtag, {
    config: { id: "G-BLW4F3YHB4" }
})

app.mount('#app')
