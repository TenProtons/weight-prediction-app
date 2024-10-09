<template>
  <form class="user-input-form" @submit.prevent="onSubmit">
    <InputField
      v-model="formData.weight"
      class="user-input-form__input"
      type="number"
      :min="weightMin"
      :max="weightMax"
      :maxlength="3"
      :label="`${t('currentWeight')} (${weightUnit})`"
      :error="validationErrors.weight"
      required
    />

    <InputField
      v-model="formData.targetWeight"
      class="user-input-form__input"
      type="number"
      :min="weightMin"
      :max="weightMax"
      :maxlength="3"
      :label="`${t('targetWeight')} (${weightUnit})`"
      :error="validationErrors.targetWeight"
      required
    />

    <InputField
      v-model="formData.timeFrame"
      class="user-input-form__input"
      type="number"
      :maxlength="3"
      :label="`${t('timeFrame')} (${t('days')})`"
      :error="validationErrors.timeFrame"
      required
    />

    <InputField
      v-model="formData.currentCalorieIntake"
      class="user-input-form__input"
      type="number"
      :maxlength="5"
      :label="`${t('calorieIntake')} (${t('kcal')})`"
      :error="validationErrors.currentCalorieIntake"
      required
    />

    <InputField
      v-model="formData.height"
      class="user-input-form__input"
      type="number"
      :maxlength="3"
      :label="`${t('height')} (${heightUnit})`"
      :error="validationErrors.height"
      required
    />

    <InputField
      v-model="formData.age"
      class="user-input-form__input"
      type="number"
      :maxlength="3"
      :label="`${t('age')} (${t('years')})`"
      :error="validationErrors.age"
      required
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
import { UserData } from '@/interfaces/UserData';
import { defineComponent, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InputField from '@/components/InputField.vue';
import SelectField from '@/components/SelectField.vue';
import ActivityInfo from '@/components/ActivityInfo.vue';

export default defineComponent({
  name: 'UserInputForm',
  components: {
    InputField,
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
    const validationErrors = ref<Record<string, string>>({});
    const isFormValid = computed(() => {
      return Object.keys(validationErrors.value).length === 0;
    });
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

    const validateForm = () => {
      validateWeight();
      validateTargetWeight();
      validateTimeFrame();
      validateCurrentCalorieIntake();
      validateHeight();
      validateAge();
    };

    const validateWeight = () => {
      const min = weightMin.value;
      const max = weightMax.value;
      if (formData.value.weight < min || formData.value.weight > max) {
        validationErrors.value.weight = t('invalidWeight', {
          weightMin: min,
          weightMax: max,
          weightUnit: weightUnit.value,
        });
      } else {
        delete validationErrors.value.weight;
      }
    };

    const validateTargetWeight = () => {
      const min = weightMin.value;
      const max = weightMax.value;
      if (formData.value.targetWeight < min || formData.value.targetWeight > max) {
        validationErrors.value.targetWeight = t('invalidTargetWeight', {
          weightMin: min,
          weightMax: max,
          weightUnit: weightUnit.value,
        });
      } else {
        if (validationErrors.value.targetWeight) {
          delete validationErrors.value.targetWeight;
        }
      }
    };

    const validateTimeFrame = () => {
      if (formData.value.timeFrame < 14 || formData.value.timeFrame > 365) {
        validationErrors.value.timeFrame = t('invalidTimeFrame');
      } else {
        delete validationErrors.value.timeFrame;
      }
    };

    const validateCurrentCalorieIntake = () => {
      if (formData.value.currentCalorieIntake < 800 || formData.value.currentCalorieIntake > 8000) {
        validationErrors.value.currentCalorieIntake = t('invalidCalorieIntake');
      } else {
        delete validationErrors.value.currentCalorieIntake;
      }
    };

    const validateHeight = () => {
      const min = heightMin.value;
      const max = heightMax.value;
      if (formData.value.height < min || formData.value.height > max) {
        validationErrors.value.height = t('invalidHeight', {
          heightMin: min,
          heightMax: max,
          heightUnit: heightUnit.value,
        });
      } else {
        delete validationErrors.value.height;
      }
    };

    const validateAge = () => {
      if (formData.value.age < 10 || formData.value.age > 120) {
        validationErrors.value.age = t('invalidAge');
      } else {
        delete validationErrors.value.age;
      }
    };

    const onSubmit = () => {
      validateForm();
      if (isFormValid.value) {
        emit('calculate', { ...formData.value });
      }
    };

    watch(
      () => props.initialUserData,
      (newVal) => {
        if (newVal) {
          formData.value = { ...newVal };
          validateForm();
        }
      },
      { immediate: true }
    );

    // Watchers for each field
    watch(
      () => formData.value.weight,
      () => {
        validateWeight();
      }
    );

    watch(
      () => formData.value.targetWeight,
      () => {
        validateTargetWeight();
      }
    );

    watch(
      () => formData.value.timeFrame,
      () => {
        validateTimeFrame();
      }
    );

    watch(
      () => formData.value.currentCalorieIntake,
      () => {
        validateCurrentCalorieIntake();
      }
    );

    watch(
      () => formData.value.height,
      () => {
        validateHeight();
      }
    );

    watch(
      () => formData.value.age,
      () => {
        validateAge();
      }
    );

    return {
      t,
      formData,
      validationErrors,
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
