<template>
  <div class="main-view">
    <h1>{{ t('appTitle') }}</h1>
    <div v-if="weightData.length">
      <WeightChart :weight-data="weightData" />
      <p>{{ hintMessage }}</p>
    </div>
    <UserInputForm :initial-user-data="userData" @calculate="handleCalculate" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import UserInputForm from '@/components/UserInputForm.vue';
import WeightChart from '@/components/WeightChart.vue';
import { calculateCalorieAdjustment, predictWeightOverTime } from '@/utils/calculator';
import { saveData, loadData } from '@/services/storage';
import { UserData } from '@/interfaces/UserData';
import { defaultUserData } from '@/constants';

export default defineComponent({
  name: 'MainView',
  components: {
    UserInputForm,
    WeightChart,
  },
  setup() {
    const { t } = useI18n();

    const weightData = ref<Array<{ day: number; weight: number }>>([]);
    const hintMessage = ref('');
    const userData = ref<UserData | null>(null);

    const handleCalculate = (inputUserData: UserData) => {
      saveData('userData', inputUserData);
      userData.value = inputUserData;

      const calorieAdjustment = Math.abs(calculateCalorieAdjustment(inputUserData));
      hintMessage.value = t('weightChangeHint', {
        calories: calorieAdjustment.toFixed(2),
      });

      weightData.value = predictWeightOverTime(inputUserData);
    };

    onMounted(() => {
      const savedUserData = loadData('userData');

      if (savedUserData) {
        userData.value = savedUserData;
        handleCalculate(savedUserData);
      } else {
        userData.value = defaultUserData;
        handleCalculate(defaultUserData);
      }
    });

    return {
      weightData,
      hintMessage,
      handleCalculate,
      t,
      userData,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
