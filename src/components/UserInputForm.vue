<template>
  <form class="user-input-form" @submit.prevent="onSubmit">
    <SliderComponent
      v-model.number="formData.weight"
      :min="weightMin"
      :max="weightMax"
      :step="weightStep"
      :label="`${t('currentWeight')} (${weightUnit})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SliderComponent
      v-model.number="formData.targetWeight"
      :min="weightMin"
      :max="weightMax"
      :step="weightStep"
      :label="`${t('targetWeight')} (${weightUnit})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SliderComponent
      v-model="formData.timeFrame"
      :min="14"
      :max="365"
      :step="1"
      :label="`${t('timeFrame')} (${t('days')})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SliderComponent
      v-model.number="formData.currentCalorieIntake"
      :min="800"
      :max="8000"
      :step="50"
      :label="`${t('calorieIntake')} (${t('kcal')})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SliderComponent
      v-model.number="formData.height"
      :min="heightMin"
      :max="heightMax"
      :step="heightStep"
      :label="`${t('height')} (${heightUnit})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SliderComponent
      v-model.number="formData.age"
      :min="10"
      :max="120"
      :step="1"
      :label="`${t('age')} (${t('years')})`"
      is-manual-adjust
      @calculate="onSubmit"
    />

    <SelectField
      v-model="formData.gender"
      class="user-input-form__select"
      :label="t('gender')"
      :options="genderOptions"
      required
    />

    <div class="user-input-form__activity-wrapper">
      <SelectField
        v-model="formData.activityLevel"
        class="user-input-form__select"
        :label="t('activityLevel')"
        :options="activityLevelOptions"
        required
      />
      <ActivityInfo class="user-input-form__activity-tooltip" />
    </div>

    <button class="user-input-form__submit-button regular-button" type="submit" :disabled="!isFormValid">
      {{ t('calculate') }}
    </button>
  </form>
</template>

<script lang="ts">
import ActivityInfo from '@/components/ActivityInfo.vue';
import SelectField from '@/components/SelectField.vue';
import SliderComponent from '@/components/SliderComponent.vue';
import { UserData } from '@/interfaces/UserData';
import { computed, defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UserInputForm',
  components: {
    SliderComponent,
    SelectField,
    ActivityInfo,
  },
  props: {
    initialUserData: {
      type: Object as () => UserData | null,
      default: null,
    },
    unitSystem: {
      type: String as () => 'metric' | 'imperial',
      default: 'metric',
    },
  },
  emits: ['calculate'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const formData = ref<UserData>({} as UserData);
    const isFormValid = ref(true);
    const genderOptions = computed(() => [
      { value: 'male', label: t('male') },
      { value: 'female', label: t('female') },
    ]);
    const activityLevelOptions = computed(() => [
      { value: 'sedentary', label: t('sedentary') },
      { value: 'light', label: t('light') },
      { value: 'moderate', label: t('moderate') },
      { value: 'active', label: t('active') },
      { value: 'veryActive', label: t('veryActive') },
    ]);

    // Computed properties for units and ranges
    const weightUnit = computed(() => (props.unitSystem === 'metric' ? t('kg') : t('lbs')));
    const heightUnit = computed(() => (props.unitSystem === 'metric' ? t('cm') : t('inches')));
    const weightMin = computed(() => (props.unitSystem === 'metric' ? 40 : 88)); // 40 kg ~ 88 lbs
    const weightMax = computed(() => (props.unitSystem === 'metric' ? 250 : 550)); // 250 kg ~ 550 lbs
    const heightMin = computed(() => (props.unitSystem === 'metric' ? 100 : 39)); // 100 cm ~ 39 inches
    const heightMax = computed(() => (props.unitSystem === 'metric' ? 250 : 98)); // 250 cm ~ 98 inches

    // Steps for sliders
    const weightStep = computed(() => (props.unitSystem === 'metric' ? 0.5 : 1));
    const heightStep = computed(() => (props.unitSystem === 'metric' ? 1 : 0.5));

    const onSubmit = () => {
      emit('calculate', { ...formData.value });
    };

    watch(
      () => props.initialUserData,
      (newVal) => {
        if (newVal) {
          formData.value = { ...newVal };
        }
      },
      { immediate: true }
    );

    return {
      t,
      formData,
      onSubmit,
      isFormValid,
      genderOptions,
      activityLevelOptions,
      weightUnit,
      heightUnit,
      weightMin,
      weightMax,
      heightMin,
      heightMax,
      weightStep,
      heightStep,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-input-form {
  display: flex;
  flex-direction: column;
  gap: var(--20);
  background-color: var(--background-color);
  color: var(--text-color);

  &__select {
    flex: 1;
  }

  &__activity-wrapper {
    display: flex;
    gap: var(--16);
  }

  &__activity-tooltip {
    margin-top: auto;
  }

  &__submit-button {
    margin: var(--16) auto 0;
    max-width: 200px;
  }
}
</style>
