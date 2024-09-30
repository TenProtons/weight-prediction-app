<template>
  <div class="main-view">
    <h1>{{ t('appTitle') }}</h1>
    <div v-if="weightData.length">
      <WeightChart :weight-data="weightData" />
      <p :key="warningKey" :class="{ warning: isWarning }">{{ hintMessage }}</p>
    </div>
    <UserInputForm :initial-user-data="userData" @calculate="handleCalculate" />
  </div>
</template>

<script lang="ts">
import UserInputForm from '@/components/UserInputForm.vue';
import WeightChart from '@/components/WeightChart.vue';
import { defaultUserData } from '@/constants';
import { UserData } from '@/interfaces/UserData';
import { loadData, saveData } from '@/services/storage';
import { calculateCalorieAdjustment, predictWeightOverTime } from '@/utils/calculator';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainView',
  components: {
    UserInputForm,
    WeightChart,
  },
  setup() {
    const { t, locale } = useI18n();
    const weightData = ref<Array<{ day: number; weight: number }>>([]);
    const userData = ref<UserData | null>(null);
    const hintMessage = ref('');
    const isWarning = ref(false);
    const warningKey = ref(0);

    const handleCalculate = (inputUserData: UserData) => {
      saveData('userData', inputUserData);
      userData.value = inputUserData;

      // Calculate the calorie adjustment
      const calorieAdjustment = Number(calculateCalorieAdjustment(inputUserData).toFixed());

      // Calculate the adjusted caloric intake
      const adjustedCaloricIntake = Number((inputUserData.currentCalorieIntake + calorieAdjustment).toFixed());

      // Define thresholds for warnings
      const lowerThreshold = inputUserData.currentCalorieIntake / 2;
      const upperThreshold = inputUserData.currentCalorieIntake * 1.5;

      // Check if a warning is needed
      if (adjustedCaloricIntake < lowerThreshold) {
        // Caloric intake is too low
        const consumptionLevel = t('tooLow');
        hintMessage.value = t('warningMessage', { consumptionLevel });
        isWarning.value = true;
        warningKey.value += 1;
      } else if (adjustedCaloricIntake > upperThreshold) {
        // Caloric intake is too high
        const consumptionLevel = t('tooHigh');
        hintMessage.value = t('warningMessage', { consumptionLevel });
        isWarning.value = true;
        warningKey.value += 1;
      } else {
        // Determine the action word
        const actionKey = calorieAdjustment > 0 ? 'increase' : 'decrease';
        const action = t(actionKey);

        // Use the consolidated hint message
        hintMessage.value = t('adjustCalorieHint', {
          action,
          currentCalories: inputUserData.currentCalorieIntake,
          adjustedCalories: adjustedCaloricIntake,
        });
        isWarning.value = false;
      }

      weightData.value = predictWeightOverTime(inputUserData);
    };

    watch(locale, () => {
      if (userData.value) {
        handleCalculate(userData.value);
      }
    });

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
      warningKey,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-view {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--20);
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
