import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { ElSwitch } from 'element-plus';
import 'element-plus/es/components/switch/style/css';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.component('ElSwitch', ElSwitch);

app.mount('#app');
