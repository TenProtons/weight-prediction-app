<template>
  <form class="form-container" @submit.prevent="onSubmit">
    <InputField
      v-model="formData.weight"
      class="form-container__input"
      type="number"
      :min="40"
      :max="250"
      :maxlength="3"
      :label="currentWeightLabel"
      :error="validationErrors.weight"
      required
    />

    <InputField
      v-model="formData.targetWeight"
      class="form-container__input"
      type="number"
      :min="40"
      :max="250"
      :maxlength="3"
      :label="targetWeightLabel"
      :error="validationErrors.targetWeight || validationErrors.weightDifference"
      required
    />

    <InputField
      v-model="formData.timeFrame"
      class="form-container__input"
      type="number"
      :maxlength="3"
      :label="timeFrameLabel"
      :error="validationErrors.timeFrame"
      required
    />

    <InputField
      v-model="formData.currentCalorieIntake"
      class="form-container__input"
      type="number"
      :maxlength="5"
      :label="calorieIntakeLabel"
      :error="validationErrors.currentCalorieIntake"
      required
    />

    <InputField
      v-model="formData.height"
      class="form-container__input"
      type="number"
      :maxlength="3"
      :label="heightLabel"
      :error="validationErrors.height"
      required
    />

    <InputField
      v-model="formData.age"
      class="form-container__input"
      type="number"
      :maxlength="3"
      :label="ageLabel"
      :error="validationErrors.age"
      required
    />

    <SelectField
      v-model="formData.gender"
      class="form-container__select"
      :label="t('gender')"
      :options="genderOptions"
      required
    />

    <SelectField
      v-model="formData.activityLevel"
      class="form-container__select"
      :label="t('activityLevel')"
      :options="activityLevelOptions"
      required
    />

    <button class="form-container__submit-button" type="submit" :disabled="!isFormValid">
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

export default defineComponent({
  name: 'UserInputForm',
  components: {
    InputField,
    SelectField,
  },
  props: {
    initialUserData: {
      type: Object as () => UserData | null,
      default: null,
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
    const currentWeightLabel = computed(() => `${t('currentWeight')} (${t('kg')})`);
    const targetWeightLabel = computed(() => `${t('targetWeight')} (${t('kg')})`);
    const timeFrameLabel = computed(() => `${t('timeFrame')} (${t('days')})`);
    const calorieIntakeLabel = computed(() => `${t('calorieIntake')} (${t('kcal')})`);
    const heightLabel = computed(() => `${t('height')} (${t('cm')})`);
    const ageLabel = computed(() => `${t('age')} (${t('years')})`);
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
        validateWeightDifference();
      }
    );

    watch(
      () => formData.value.targetWeight,
      () => {
        validateTargetWeight();
        validateWeightDifference();
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

    const validateForm = () => {
      validateWeight();
      validateTargetWeight();
      validateWeightDifference();
      validateTimeFrame();
      validateCurrentCalorieIntake();
      validateHeight();
      validateAge();
    };

    const validateWeight = () => {
      if (formData.value.weight < 40 || formData.value.weight > 250) {
        validationErrors.value.weight = t('invalidWeight');
      } else {
        delete validationErrors.value.weight;
      }
    };

    const validateTargetWeight = () => {
      if (formData.value.targetWeight < 40 || formData.value.targetWeight > 250) {
        validationErrors.value.targetWeight = t('invalidTargetWeight');
      } else {
        if (validationErrors.value.targetWeight === t('invalidTargetWeight')) {
          delete validationErrors.value.targetWeight;
        }
      }
    };

    const validateWeightDifference = () => {
      const weightDiff = Math.abs(formData.value.weight - formData.value.targetWeight);
      if (weightDiff > 80) {
        validationErrors.value.weightDifference = t('invalidWeightDifference');
      } else {
        if (validationErrors.value.weightDifference === t('invalidWeightDifference')) {
          delete validationErrors.value.weightDifference;
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
      if (formData.value.height < 100 || formData.value.height > 250) {
        validationErrors.value.height = t('invalidHeight');
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

    return {
      t,
      formData,
      validationErrors,
      onSubmit,
      isFormValid,
      genderOptions,
      activityLevelOptions,
      currentWeightLabel,
      targetWeightLabel,
      timeFrameLabel,
      calorieIntakeLabel,
      heightLabel,
      ageLabel,
    };
  },
});
</script>

<style lang="scss" scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: var(--20);
  background-color: var(--background-color);
  color: var(--text-color);

  &__submit-button {
    margin: var(--16) auto 0;
    max-width: 200px;
    padding: var(--8) var(--16);
    background-color: var(--button-background);
    color: var(--button-text-color);
    border: none;
    cursor: pointer;

    &:disabled {
      background-color: var(--button-background-disabled);
      color: var(--button-text-color-disabled);
      cursor: not-allowed;
    }

    &:not(:disabled):hover {
      background-color: var(--button-background-hover);
    }
  }
}
</style>
