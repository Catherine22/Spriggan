import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import locale from 'element-plus/lib/locale/lang/en';
import 'element-plus/lib/theme-chalk/index.css';
import '@/assets/css/reset.css';
import '@/assets/css/style.css';

const app = createApp(App);
app.use(ElementPlus, locale);
app.use(router);
app.mount('#app');
