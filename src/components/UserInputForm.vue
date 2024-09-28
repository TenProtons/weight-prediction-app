<template>
  <form @submit.prevent="onSubmit">
    <div>
      <label>{{ $t('currentWeight') }} (kg):</label>
      <input v-model.number="userData.weight" type="number" required />
    </div>
    <div>
      <label>{{ $t('targetWeight') }} (kg):</label>
      <input v-model.number="userData.targetWeight" type="number" required />
    </div>
    <div>
      <label>{{ $t('timeFrame') }} (days):</label>
      <input v-model.number="userData.timeFrame" type="number" required />
    </div>
    <div>
      <label>{{ $t('calorieIntake') }} (kcal):</label>
      <input v-model.number="userData.currentCalorieIntake" type="number" required />
    </div>
    <div>
      <label>{{ $t('height') }} (cm):</label>
      <input v-model.number="userData.height" type="number" required />
    </div>
    <div>
      <label>Age (years):</label>
      <input v-model.number="userData.age" type="number" required />
    </div>
    <div>
      <label>Gender:</label>
      <select v-model="userData.gender" required>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    <div>
      <label>{{ $t('activityLevel') }}:</label>
      <select v-model="userData.activityLevel" required>
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
import { defineComponent, ref } from 'vue';
import { UserData } from '@/utils/calculator';

export default defineComponent({
  name: 'UserInputForm',
  emits: ['calculate'],
  setup(props, { emit }) {
    const userData = ref<UserData>({
      weight: 70,
      targetWeight: 65,
      height: 170,
      age: 30,
      gender: 'male',
      activityLevel: 'moderate',
      currentCalorieIntake: 2000,
      timeFrame: 30,
    });

    const onSubmit = () => {
      emit('calculate', userData.value);
    };

    return {
      userData,
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
