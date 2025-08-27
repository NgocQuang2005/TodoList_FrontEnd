import { createApp } from 'vue';
import './main.css'
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config'; 
import Button from 'primevue/button';
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Aura from '@primevue/themes/aura';
import Dialog from 'primevue/dialog';
// CSS
import 'primeicons/primeicons.css'; // Icons
import 'primeflex/primeflex.css';   // Layout utilities

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});
app.component('Button', Button);
app.component("Card", Card);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("Dialog", Dialog);
app.mount('#app');
