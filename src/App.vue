<template>
  <div :class="['app', theme]">
    <div class="top-bar">
      <div class="language-switcher">
        <button @click="changeLanguage('uk')">Українська</button>
        <button @click="changeLanguage('en')">English</button>
      </div>
      <div class="theme-switcher">
        <button @click="toggleTheme">
          {{ theme === 'dark-mode' ? t('lightMode') : t('darkMode') }}
        </button>
      </div>
    </div>
    <router-view />
    <nav>
      <router-link to="/">{{ t('main') }}</router-link> |
      <router-link to="/about">{{ t('about') }}</router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'App',
  setup() {
    const { locale, t } = useI18n();
    const theme = ref('light-mode');

    const changeLanguage = (lang: string) => {
      locale.value = lang;
      localStorage.setItem('Weight Prediction App language', lang);
    };

    const toggleTheme = () => {
      theme.value = theme.value === 'dark-mode' ? 'light-mode' : 'dark-mode';
      document.documentElement.className = theme.value;
      localStorage.setItem('theme', theme.value);
    };

    const detectPreferredTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        theme.value = savedTheme;
      } else {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        theme.value = mediaQuery.matches ? 'dark-mode' : 'light-mode';
        mediaQuery.addEventListener('change', (e) => {
          if (!localStorage.getItem('theme')) {
            theme.value = e.matches ? 'dark-mode' : 'light-mode';
            document.documentElement.className = theme.value;
          }
        });
      }
      document.documentElement.className = theme.value;
    };

    onMounted(() => {
      detectPreferredTheme();
    });

    return {
      changeLanguage,
      toggleTheme,
      theme,
      t,
    };
  },
});
</script>

<style lang="scss">
.app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: var(--text-color);
  background-color: var(--background-color);
  transition: background-color 0.3s, color 0.3s;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  padding: var(--20);
}

.language-switcher {
  display: flex;
  gap: var(--8);
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: var(--link-color);

    &.router-link-exact-active {
      color: var(--active-link-color);
    }
  }
}
</style>
