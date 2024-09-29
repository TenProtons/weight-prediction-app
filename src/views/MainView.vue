<template>
  <div class="main-view">
    <h1>{{ t('appTitle') }}</h1>
    <div v-if="weightData.length">
      <WeightChart :weight-data="weightData" />
      <p :class="{ warning: isWarning }">{{ hintMessage }}</p>
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
    const userData = ref<UserData | null>(null);
    const hintMessage = ref('');
    const isWarning = ref(false);

    const handleCalculate = (inputUserData: UserData) => {
      saveData('userData', inputUserData);
      userData.value = inputUserData;
      const calorieAdjustment = Number(Math.abs(calculateCalorieAdjustment(inputUserData)).toFixed(2));

      if (calorieAdjustment > inputUserData.currentCalorieIntake / 2) {
        // Display warning message
        hintMessage.value = t('warningMessage');
        isWarning.value = true;
      } else {
        // Display regular hint message
        hintMessage.value = t('weightChangeHint', {
          calories: calorieAdjustment,
        });
        isWarning.value = false;
      }

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
      isWarning,
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

.warning {
  animation: blink-red 1s ease-in-out 0s 3;
}

@keyframes blink-red {
  0% {
    background-color: transparent;
  }

  100% {
    background-color: transparent;
  }

  50% {
    background-color: rgba(255, 0, 0, 0.3);
  }
}
</style>
