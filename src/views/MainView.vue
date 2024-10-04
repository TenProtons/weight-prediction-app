<template>
  <div class="main-view">
    <h1>{{ t('appTitle') }}</h1>
    <div v-if="weightData.length">
      <div class="charts-wrapper">
        <WeightChart :weight-data="weightData" />

        <DoughnutChart
          :labels="macronutrientLabels"
          :data="macronutrientCalories"
          :grams="macronutrientGrams"
          :background-colors="macronutrientColors"
          :adjusted-caloric-intake="adjustedCaloricIntake"
        />
      </div>
      <p :key="warningKey" class="main-view__calculated-info" :class="{ warning: isWarning }">{{ hintMessage }}</p>
    </div>
    <UserInputForm :initial-user-data="userData" @calculate="handleCalculate" />
  </div>
</template>

<script lang="ts">
import DoughnutChart from '@/components/DoughnutChart.vue';
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
    DoughnutChart,
  },
  setup() {
    const { t, locale } = useI18n();
    const weightData = ref<Array<{ day: number; weight: number }>>([]);
    const userData = ref<UserData | null>(null);
    const hintMessage = ref('');
    const isWarning = ref(false);
    const warningKey = ref(0);

    // Reactive variables for charts
    const macronutrientLabels = ref<string[]>([]);
    const macronutrientCalories = ref<number[]>([]);
    const macronutrientGrams = ref<number[]>([]);
    const macronutrientColors = ref<string[]>([]);
    const adjustedCaloricIntake = ref<number>(0);

    // Define macronutrient ratios based on evidence-based guidelines
    const proteinRatio = 0.3;
    const fatRatio = 0.25;
    const carbRatio = 0.45;

    // Define calories per gram for each macronutrient
    const caloriesPerGram = {
      protein: 4,
      fat: 9,
      carbs: 4,
    };

    const handleCalculate = (inputUserData: UserData) => {
      saveData('userData', inputUserData);
      userData.value = inputUserData;

      // Calculate the calorie adjustment
      const calorieAdjustment = Math.round(calculateCalorieAdjustment(inputUserData));

      // Calculate the adjusted caloric intake
      adjustedCaloricIntake.value = Math.round(inputUserData.currentCalorieIntake + calorieAdjustment);

      // Define thresholds for warnings
      const lowerThreshold = inputUserData.currentCalorieIntake / 2;
      const upperThreshold = inputUserData.currentCalorieIntake * 3;

      // Check if a warning is needed
      if (adjustedCaloricIntake.value < lowerThreshold) {
        // Caloric intake is too low
        const consumptionLevel = t('tooLow');
        hintMessage.value = t('warningMessage', { consumptionLevel });
        isWarning.value = true;
        warningKey.value += 1;
      } else if (adjustedCaloricIntake.value > upperThreshold) {
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
          adjustedCalories: adjustedCaloricIntake.value,
        });
        isWarning.value = false;
      }

      // Predict weight over time
      weightData.value = predictWeightOverTime(inputUserData);

      // Calculate macronutrient distribution
      const proteinCalories = Math.round(adjustedCaloricIntake.value * proteinRatio);
      const fatCalories = Math.round(adjustedCaloricIntake.value * fatRatio);
      let carbCalories = Math.round(adjustedCaloricIntake.value * carbRatio);

      // Calculate grams for each macronutrient
      const proteinGrams = Math.round(proteinCalories / caloriesPerGram.protein);
      const fatGrams = Math.round(fatCalories / caloriesPerGram.fat);
      const carbGrams = Math.round(carbCalories / caloriesPerGram.carbs);

      // Prepare data for Doughnut Chart
      macronutrientLabels.value = [t('protein'), t('fats'), t('carbohydrates')];
      macronutrientCalories.value = [proteinCalories, fatCalories, carbCalories];
      macronutrientGrams.value = [proteinGrams, fatGrams, carbGrams];
      macronutrientColors.value = ['--protein-color', '--fat-color', '--carb-color'];
    };

    // Watch for locale changes to re-calculate translations
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
      // Chart data for DoughnutChart
      macronutrientLabels,
      macronutrientCalories,
      macronutrientGrams,
      macronutrientColors,
      adjustedCaloricIntake,
    };
  },
});
</script>

<style lang="scss" scoped>
.main-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  max-width: 725px;
  margin: 0 auto;
  padding: 0 var(--20) var(--20) var(--20);

  &__calculated-info {
    margin-block: var(--24);
    padding: var(--4);
    border: var(--calculated-info-border);
    border-radius: var(--border-radius-4);
  }
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
    background-color: var(--error-background-color);
  }
}
</style>
