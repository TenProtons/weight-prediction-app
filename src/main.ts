// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';
import './styles/styles.scss';

// Import locale messages
import en from './locales/en.json';
import uk from './locales/uk.json';

const messages = {
  en,
  uk,
};

const savedLanguage = localStorage.getItem('Weight Prediction App language') || 'en';

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  messages,
});

const app = createApp(App);

app.use(router);
app.use(i18n);

// Register $t globally
app.config.globalProperties.$t = i18n.global.t;

// Mount the app
app.mount('#app');
