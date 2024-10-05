<template>
  <div class="calorie-accuracy-info">
    <button class="calorie-accuracy-info__button regular-button" @click="isPopupVisible = true">?</button>
    <PopupComponent :show="isPopupVisible" :header-text="t('calculateAccuracy')" @close="isPopupVisible = false">
      <p>This is the content inside the popup.</p>
    </PopupComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PopupComponent from './PopupComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'CalorieAccuracyInfo',
  components: {
    PopupComponent,
  },
  setup() {
    const { t } = useI18n();
    const isPopupVisible = ref(false);

    return {
      isPopupVisible,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.calorie-accuracy-info {
  display: flex;

  &__button {
    display: flex;
    height: 32px;
    width: 32px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: large;
    font-weight: bold;
    color: var(--button-text-color);
  }
}
</style>
