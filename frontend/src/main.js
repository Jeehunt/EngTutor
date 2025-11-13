import { createApp } from 'vue'
import router from './router/index.js'
import './style.css'
import App from './App.vue'

console.log('main.js loaded')

try {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
  console.log('Vue app mounted successfully')
} catch (error) {
  console.error('Error mounting Vue app:', error)
}
