<template>
  <div class="calorie-accuracy-info">
    <button class="calorie-accuracy-info__button regular-button tooltip-button" @click="isPopupVisible = true">
      ?
    </button>
    <PopupComponent :show="isPopupVisible" :header-text="t('activityTooltip.header')" @close="isPopupVisible = false">
      <ul>
        <li class="tooltip-list-item" v-html="t('activityTooltip.sedentary')"></li>
        <li class="tooltip-list-item" v-html="t('activityTooltip.light')"></li>
        <li class="tooltip-list-item" v-html="t('activityTooltip.moderate')"></li>
        <li class="tooltip-list-item" v-html="t('activityTooltip.active')"></li>
        <li class="tooltip-list-item" v-html="t('activityTooltip.veryActive')"></li>
      </ul>
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

  ul {
    display: flex;
    flex-direction: column;
    gap: var(--8);
    list-style: none;
    padding-left: 0;
  }
}
</style>
