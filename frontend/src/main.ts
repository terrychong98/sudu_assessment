import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import "primeicons/primeicons.css";
import "./assets/main.css";

const app = createApp(App);
app.use(createPinia());
app.use(PrimeVue, {
  // Default theme configuration
  theme: {
    preset: Aura,
  },
});
app.mount("#app");
