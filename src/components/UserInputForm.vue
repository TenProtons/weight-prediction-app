<template>
  <form class="form-container" @submit.prevent="onSubmit">
    <InputField
      v-model="formData.weight"
      type="number"
      :label="currentWeightLabel"
      :error="validationErrors.weight"
      required
    />

    <InputField
      v-model="formData.targetWeight"
      type="number"
      :label="targetWeightLabel"
      :error="validationErrors.targetWeight || validationErrors.weightDifference"
      required
    />

    <InputField
      v-model="formData.timeFrame"
      type="number"
      :label="timeFrameLabel"
      :error="validationErrors.timeFrame"
      required
    />

    <InputField
      v-model="formData.currentCalorieIntake"
      type="number"
      :label="calorieIntakeLabel"
      :error="validationErrors.currentCalorieIntake"
      required
    />

    <InputField
      v-model="formData.height"
      type="number"
      :label="heightLabel"
      :error="validationErrors.height"
      required
    />

    <InputField v-model="formData.age" :label="ageLabel" type="number" :error="validationErrors.age" required />

    <SelectField v-model="formData.gender" :label="t('gender')" :options="genderOptions" required />

    <SelectField
      v-model="formData.activityLevel"
      :label="t('activityLevel')"
      :options="activityLevelOptions"
      required
    />

    <button type="submit" :disabled="!isFormValid">
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
    const currentWeightLabel = computed(() => `${t('currentWeight')} (kg)`);
    const targetWeightLabel = computed(() => `${t('targetWeight')} (kg)`);
    const timeFrameLabel = computed(() => `${t('timeFrame')} (days)`);
    const calorieIntakeLabel = computed(() => `${t('calorieIntake')} (kcal)`);
    const heightLabel = computed(() => `${t('height')} (cm)`);
    const ageLabel = computed(() => `${t('age')} (years)`);
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
      isFormValid,
      onSubmit,
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
  background-color: var(--background-color);
  color: var(--text-color);
}

input,
select {
  background-color: var(--input-background);
  color: var(--input-text-color);
}

button {
  background-color: var(--button-background);
  color: var(--button-text-color);
}
</style>
