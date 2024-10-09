<template>
  <div class="calorie-accuracy-info">
    <button class="calorie-accuracy-info__button regular-button" @click="isPopupVisible = true">?</button>
    <PopupComponent
      :show="isPopupVisible"
      :header-text="t('calculateAccuracyTooltip.header')"
      @close="isPopupVisible = false"
    >
      <h4 class="tooltip-title">{{ t('calculateAccuracyTooltip.title') }}</h4>
      <span class="tooltip-description" v-html="formattedDescription"></span>
    </PopupComponent>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import PopupComponent from './PopupComponent.vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'CalorieAccuracyInfo',
  components: {
    PopupComponent,
  },
  props: {
    adjustedCaloricIntake: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n();
    const isPopupVisible = ref(false);

    const lowerLimit = computed(() => {
      return Math.round(props.adjustedCaloricIntake * 0.9);
    });

    const upperLimit = computed(() => {
      return Math.round(props.adjustedCaloricIntake * 1.1);
    });

    const formattedDescription = computed(() =>
      t('calculateAccuracyTooltip.description', {
        adjustedCaloricIntake: props.adjustedCaloricIntake,
        lowerLimit: lowerLimit.value,
        upperLimit: upperLimit.value,
      })
    );

    return {
      isPopupVisible,
      lowerLimit,
      upperLimit,
      t,
      formattedDescription,
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
