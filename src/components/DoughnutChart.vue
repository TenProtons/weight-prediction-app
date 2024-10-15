<template>
  <div class="doughnut-chart-container">
    <canvas ref="doughnutCanvas"></canvas>
    <div class="doughnut-chart-container__calories">
      <span class="number">{{ adjustedCaloricIntake }}</span>
      <span class="units">{{ `${t('kcal')}/${t('daySmall')}` }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import Chart, { ChartOptions, TooltipItem } from 'chart.js/auto';
import { defineComponent, onBeforeUnmount, onMounted, PropType, ref, shallowRef, watch } from 'vue';
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
    const chartInstance = shallowRef<Chart<'doughnut'> | null>(null);

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
              const grams = props.grams[index];
              const calories = props.data[index];
              return `${grams} ${t('gramm')} = ${calories} ${t('kcal')}`;
            },
          },
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: t('macronutrientDistribution'),
          color: getCSSVariable('--chart-font-color'),
        },
      },
      cutout: '70%',
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
                  backgroundColor: props.backgroundColors.map((color) => getCSSVariable(color)),
                  hoverBackgroundColor: props.backgroundColors.map((color) => getCSSVariable(color)),
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
        // chartInstance.value.data.labels - titles in tooltips
        chartInstance.value.data.labels = props.labels;
        chartInstance.value.data.datasets[0].data = props.data;
        chartInstance.value.data.datasets[0].backgroundColor = props.backgroundColors.map((color) =>
          getCSSVariable(color)
        );
        chartInstance.value.update();
      }
    };

    const updateChartTranslations = () => {
      if (chartInstance.value) {
        if (chartInstance.value.options.plugins?.title) {
          chartInstance.value.options.plugins.title.text = t('macronutrientDistribution');
        }

        if (chartInstance.value.options.plugins?.tooltip?.callbacks) {
          chartInstance.value.options.plugins.tooltip.callbacks.label = (tooltipItem: TooltipItem<'doughnut'>) => {
            const index = tooltipItem.dataIndex!;
            const grams = props.grams[index];
            const calories = props.data[index];
            return `${grams} ${t('gramm')} = ${calories} ${t('kcal')}`;
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

    const updateChartColors = () => {
      if (chartInstance.value) {
        const options = chartInstance.value.options as ChartOptions<'doughnut'>;
        const dataset = chartInstance.value.data.datasets[0];

        // Update dataset colors
        dataset.backgroundColor = props.backgroundColors.map((color) => getCSSVariable(color));
        dataset.hoverBackgroundColor = props.backgroundColors.map((color) => getCSSVariable(color));

        // Update chart title color
        if (options.plugins?.title) {
          options.plugins.title.color = getCSSVariable('--chart-font-color');
        }

        // Update tooltip colors
        if (options.plugins?.tooltip) {
          options.plugins.tooltip.backgroundColor = getCSSVariable('--chart-tooltip-bg');
          options.plugins.tooltip.titleColor = getCSSVariable('--chart-font-color');
          options.plugins.tooltip.bodyColor = getCSSVariable('--chart-font-color');
          options.plugins.tooltip.borderColor = getCSSVariable('--chart-line-color');
        }

        chartInstance.value.update();
      }
    };

    // Initialize and observe theme changes
    const themeObserver = new MutationObserver(() => {
      updateChartColors();
    });

    onMounted(() => {
      createChart();

      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    });

    onBeforeUnmount(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      themeObserver.disconnect();
    });

    watch(
      () => props.data,
      () => {
        updateChart();
      }
    );

    watch(
      () => locale.value,
      () => {
        updateChartTranslations();
      }
    );

    return {
      doughnutCanvas,
      t,
    };
  },
});
</script>

<style lang="scss" scoped>
.doughnut-chart-container {
  position: relative;
  height: 350px;
  width: 100%;
  isolation: isolate;

  &__calories {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -15%);
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: -1;

    .number,
    .units {
      color: var(--text-color);
      font-weight: 700;
    }

    .number {
      font-size: 2rem;
    }

    .units {
      font-size: 1.3rem;
    }
  }
}
</style>
