import { createApp } from 'vue'
import App from './App.vue'
import "@/assets/styles/main.css";
import router from './router'
import cookie from 'vue-cookies';
import store from './store';

createApp(App).use(router).use(cookie).use(store).mount('#app')

