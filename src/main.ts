// main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createI18n } from 'vue-i18n';

// Import locale messages
import en from './locales/en.json';
import uk from './locales/uk.json';

const i18n = createI18n({
  locale: 'uk', // Set default locale to Ukrainian
  fallbackLocale: 'en',
  messages: {
    en,
    uk,
  },
});

const app = createApp(App);

app.use(router);
app.use(i18n);

// Register $t globally
app.config.globalProperties.$t = i18n.global.t;

// Mount the app
app.mount('#app');
