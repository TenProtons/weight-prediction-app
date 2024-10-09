<template>
  <div class="calorie-accuracy-info">
    <button class="calorie-accuracy-info__button regular-button" @click="isPopupVisible = true">?</button>
    <PopupComponent :show="isPopupVisible" :header-text="t('activityTooltip.header')" @close="isPopupVisible = false">
      <h4 class="tooltip-title">{{ t('activityTooltip.title') }}</h4>
      <span class="tooltip-description"></span>
    </PopupComponent>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PopupComponent from './PopupComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'ActivityInfo',
  components: {
    PopupComponent,
  },
  setup(props) {
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
