<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>{{ $t('currentWeight') }} (kg):</label>
      <input v-model.number="formData.weight" type="number" required />
    </div>
    <div>
      <label>{{ $t('targetWeight') }} (kg):</label>
      <input v-model.number="formData.targetWeight" type="number" required />
    </div>
    <div>
      <label>{{ $t('timeFrame') }} (days):</label>
      <input v-model.number="formData.timeFrame" type="number" required />
    </div>
    <div>
      <label>{{ $t('calorieIntake') }} (kcal):</label>
      <input v-model.number="formData.currentCalorieIntake" type="number" required />
    </div>
    <div>
      <label>{{ $t('height') }} (cm):</label>
      <input v-model.number="formData.height" type="number" required />
    </div>
    <div>
      <label>Age (years):</label>
      <input v-model.number="formData.age" type="number" required />
    </div>
    <div>
      <label>Gender:</label>
      <select v-model="formData.gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <div>
      <label>{{ $t('activityLevel') }}:</label>
      <select v-model="formData.activityLevel" required>
        <option value="sedentary">
          {{ $t('Sedentary (little or no exercise)') }}
        </option>
        <option value="light">
          {{ $t('Lightly active (1-3 days/week)') }}
        </option>
        <option value="moderate">
          {{ $t('Moderately active (3-5 days/week)') }}
        </option>
        <option value="active">{{ $t('Very active (6-7 days/week)') }}</option>
        <option value="veryActive">
          {{ $t('Extra active (very hard exercise & physical job)') }}
        </option>
      </select>
    </div>
    <button type="submit">{{ $t('calculate') }}</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { UserData } from '@/utils/calculator';
import { defaultUserData } from '@/utils/defaultData';

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

    const formData = ref<UserData>({ ...defaultUserData });

    // Watch for changes in initialUserData and update formData
    watch(
      () => props.initialUserData,
      (newVal) => {
        if (newVal) {
          formData.value = { ...newVal };
        } else {
          formData.value = { ...defaultUserData };
        }
      },
      { immediate: true }
    );

    const onSubmit = () => {
      emit('calculate', { ...formData.value });
    };

    return {
      t,
      formData,
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
</style>
