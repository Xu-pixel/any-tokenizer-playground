import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'
import { messages } from './locales'
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

// 获取浏览器语言设置
const locale = navigator.language.startsWith('zh') ? 'zh' : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)
const router = createRouter({
  routes: [
    {
      path: '/index.html',
      redirect: '/',
    },
    ...routes,
  ],
  history: createWebHistory(import.meta.env.BASE_URL),
})
app.use(router)
app.use(PrimeVue)
app.use(i18n)
app.mount('#app')
