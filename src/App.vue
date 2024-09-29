<template>
  <div id="app">
    <div class="language-switcher">
      <button @click="changeLanguage('uk')">Українська</button>
      <button @click="changeLanguage('en')">English</button>
    </div>
    <router-view />
    <nav>
      <router-link to="/">{{ t('main') }}</router-link> |
      <router-link to="/about">{{ t('about') }}</router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale, t } = useI18n();

    const changeLanguage = (lang: string) => {
      locale.value = lang;
      localStorage.setItem('Weight Prediction App language', lang);
    };

    return {
      changeLanguage,
      t,
    };
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.language-switcher {
  margin: 20px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
