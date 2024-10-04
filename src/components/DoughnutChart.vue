<template>
  <div class="doughnut-chart-container">
    <canvas ref="doughnutCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import Chart, { ChartOptions, TooltipItem } from 'chart.js/auto';
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'DoughnutChart',
  props: {
    labels: {
      type: Array as PropType<string[]>,
      required: true,
    },
    data: {
      type: Array as PropType<number[]>,
      required: true,
    },
    grams: {
      type: Array as PropType<number[]>,
      required: true,
    },
    backgroundColors: {
      type: Array as PropType<string[]>,
      required: true,
    },
    adjustedCaloricIntake: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const doughnutCanvas = ref<HTMLCanvasElement | null>(null);
    const chartInstance = ref<Chart<'doughnut'> | null>(null);

    const getCSSVariable = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const getChartOptions = (): ChartOptions<'doughnut'> => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          enabled: true,
          displayColors: false, // Removes the colored square
          backgroundColor: getCSSVariable('--chart-tooltip-bg'),
          titleColor: getCSSVariable('--chart-font-color'),
          bodyColor: getCSSVariable('--chart-font-color'),
          borderColor: getCSSVariable('--chart-line-color'),
          borderWidth: 1,
          callbacks: {
            label: (tooltipItem: TooltipItem<'doughnut'>) => {
              const index = tooltipItem.dataIndex!;
              const label = props.labels[index];
              const grams = props.grams[index];
              const calories = props.data[index];
              return `${label}: ${grams}g - ${calories} kcal`;
            },
          },
        },
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: getCSSVariable('--chart-font-color'),
            font: {
              family: getComputedStyle(document.body).getPropertyValue('font-family').trim(),
            },
          },
        },
        title: {
          display: true,
          text: t('macronutrientDistribution'),
          color: getCSSVariable('--chart-font-color'),
          font: {
            size: 18,
            family: getComputedStyle(document.body).getPropertyValue('font-family').trim(),
          },
        },
      },
      cutout: '70%', // Adjust the cutout size as needed
    });

    const createChart = () => {
      if (doughnutCanvas.value) {
        const ctx = doughnutCanvas.value.getContext('2d');
        if (ctx) {
          chartInstance.value = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: props.labels,
              datasets: [
                {
                  data: props.data,
                  backgroundColor: props.backgroundColors,
                  hoverBackgroundColor: props.backgroundColors,
                },
              ],
            },
            options: getChartOptions(),
          });
        }
      }
    };

    const updateChart = () => {
      if (chartInstance.value) {
        chartInstance.value.data.labels = props.labels;
        chartInstance.value.data.datasets[0].data = props.data;
        chartInstance.value.data.datasets[0].backgroundColor = props.backgroundColors;
        chartInstance.value.update();
      }
    };

    const updateChartTranslations = () => {
      if (chartInstance.value) {
        // Update chart title
        if (chartInstance.value.options.plugins?.title) {
          chartInstance.value.options.plugins.title.text = t('macronutrientDistribution');
        }

        // Update tooltip callbacks
        if (chartInstance.value.options.plugins?.tooltip?.callbacks) {
          chartInstance.value.options.plugins.tooltip.callbacks.label = (tooltipItem: TooltipItem<'doughnut'>) => {
            const index = tooltipItem.dataIndex!;
            const label = props.labels[index];
            const grams = props.grams[index];
            const calories = props.data[index];
            return `${label}: ${grams}g - ${calories} kcal`;
          };
        }

        // Update legend labels if needed
        if (chartInstance.value.options.plugins?.legend?.labels) {
          // If you have dynamic legend labels that need translation, handle here
          // However, since labels are already translated in MainView, no action is needed
        }

        chartInstance.value.update();
      }
    };

    onMounted(() => {
      createChart();
    });

    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
    });

    // Watch for changes in props to update the chart
    watch(
      () => [props.labels, props.data, props.grams, props.backgroundColors],
      () => {
        updateChart();
      },
      { deep: true }
    );

    // Watch for locale changes to update translations
    watch(
      () => locale.value,
      () => {
        updateChartTranslations();
      }
    );

    return {
      doughnutCanvas,
    };
  },
});
</script>

<style lang="scss" scoped>
.doughnut-chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
