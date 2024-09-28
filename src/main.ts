import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import uk from "./locales/uk.json";

const i18n = createI18n({
  locale: "uk",
  fallbackLocale: "en",
  messages: {
    en,
    uk,
  },
});

createApp(App).use(router).use(i18n).mount("#app");
