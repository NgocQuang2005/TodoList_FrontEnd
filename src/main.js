import { createApp } from 'vue';
import './main.css';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

// PrimeVue
import PrimeVue from 'primevue/config'; 
import Aura from '@primevue/themes/aura';

// Components PrimeVue
import Button from 'primevue/button';
import Card from "primevue/card";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Dialog from 'primevue/dialog';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import Textarea from "primevue/textarea";
import Avatar from "primevue/avatar";
import Tooltip from 'primevue/tooltip';
import Toast from 'primevue/toast';
import Skeleton from 'primevue/skeleton';
import ProgressSpinner from 'primevue/progressspinner';

// Services
import ToastService from 'primevue/toastservice';
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
app.use(ToastService);

// Global components
app.component('Button', Button);
app.component("Card", Card);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("Dialog", Dialog);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("Checkbox", Checkbox);
app.component("Dropdown", Dropdown);
app.component("Calendar", Calendar);
app.component("Textarea", Textarea);
app.component("Avatar", Avatar);
app.component("Tooltip", Tooltip);
app.component("Toast", Toast);
app.component("Skeleton", Skeleton);
app.component("ProgressSpinner", ProgressSpinner);

app.mount('#app');
