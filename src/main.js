import './assets/main.css'

import { createApp } from 'vue'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import store from './store'

import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).use(router).use(store).mount('#app')
