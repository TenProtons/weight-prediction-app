<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>{{ $t('currentWeight') }} (kg):</label>
      <input v-model.number="formData.weight" type="number" required />
      <small v-if="validationErrors.weight" class="error">{{ validationErrors.weight }}</small>
    </div>
    <div>
      <label>{{ $t('targetWeight') }} (kg):</label>
      <input v-model.number="formData.targetWeight" type="number" required />
      <small v-if="validationErrors.targetWeight" class="error">{{ validationErrors.targetWeight }}</small>
    </div>
    <div>
      <label>{{ $t('timeFrame') }} (days):</label>
      <input v-model.number="formData.timeFrame" type="number" required />
      <small v-if="validationErrors.timeFrame" class="error">{{ validationErrors.timeFrame }}</small>
    </div>
    <div>
      <label>{{ $t('calorieIntake') }} (kcal):</label>
      <input v-model.number="formData.currentCalorieIntake" type="number" required />
      <small v-if="validationErrors.currentCalorieIntake" class="error">
        {{ validationErrors.currentCalorieIntake }}
      </small>
    </div>
    <div>
      <label>{{ $t('height') }} (cm):</label>
      <input v-model.number="formData.height" type="number" required />
      <small v-if="validationErrors.height" class="error">{{ validationErrors.height }}</small>
    </div>
    <div>
      <label>{{ $t('age') }} (years):</label>
      <input v-model.number="formData.age" type="number" required />
      <small v-if="validationErrors.age" class="error">{{ validationErrors.age }}</small>
    </div>
    <div>
      <label>{{ $t('gender') }}:</label>
      <select v-model="formData.gender" required>
        <option value="male">{{ $t('male') }}</option>
        <option value="female">{{ $t('female') }}</option>
      </select>
    </div>
    <div>
      <label>{{ $t('activityLevel') }}:</label>
      <select v-model="formData.activityLevel" required>
        <option value="sedentary">{{ $t('sedentary') }}</option>
        <option value="light">{{ $t('light') }}</option>
        <option value="moderate">{{ $t('moderate') }}</option>
        <option value="active">{{ $t('active') }}</option>
        <option value="veryActive">{{ $t('veryActive') }}</option>
      </select>
    </div>
    <button type="submit" :disabled="!isFormValid">{{ $t('calculate') }}</button>
  </form>
</template>

<script lang="ts">
import { UserData } from '@/interfaces/UserData';
import { defineComponent, ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'UserInputForm',
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
        delete validationErrors.value.targetWeight;
      }
    };

    const validateWeightDifference = () => {
      const weightDiff = Math.abs(formData.value.weight - formData.value.targetWeight);
      if (weightDiff > 80) {
        validationErrors.value.weightDifference = t('invalidWeightDifference');
      } else {
        delete validationErrors.value.weightDifference;
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
    };
  },
});
</script>

<style lang="scss" scoped>
form div {
  margin-bottom: 10px;
}

label {
  display: block;
}

input,
select {
  width: 100%;
}

.error {
  color: red;
  font-size: 0.9em;
}
</style>
