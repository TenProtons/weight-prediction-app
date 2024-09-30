<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, shallowRef, watch, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import Chart, { ChartOptions, DefaultDataPoint } from 'chart.js/auto';

export default defineComponent({
  name: 'WeightChart',
  props: {
    weightData: {
      type: Array as PropType<Array<{ day: number; weight: number }>>,
      required: true,
    },
  },
  setup(props) {
    const { t, locale } = useI18n();
    const chartInstance = shallowRef<Chart<'line', DefaultDataPoint<'line'>> | null>(null);
    const chartCanvas = ref<HTMLCanvasElement | null>(null);

    const getCSSVariable = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const createChart = () => {
      if (chartCanvas.value) {
        const ctx = chartCanvas.value.getContext('2d');
        if (ctx) {
          chartInstance.value = new Chart(ctx, {
            type: 'line',
            data: {
              labels: props.weightData.map((data) => data.day),
              datasets: [
                {
                  label: t('predictedWeight'),
                  data: props.weightData.map((data) => Number(data.weight.toFixed(2))),
                  fill: false,
                  borderColor: getCSSVariable('--chart-line-color'),
                  tension: 0.1,
                  pointRadius: (context: any) => {
                    const index = context.dataIndex;
                    const xScale = context.chart.scales.x;
                    const displayedTicks = xScale.ticks;

                    const displayedTickIndices = new Set(displayedTicks.map((tick: any) => tick.value));

                    return displayedTickIndices.has(index) ? 3 : 0;
                  },
                },
              ],
            },
            options: {
              interaction: {
                intersect: false,
                mode: 'index',
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: t('day'),
                    color: getCSSVariable('--chart-font-color'),
                  },
                  ticks: {
                    maxTicksLimit: 20,
                    autoSkip: true,
                    maxRotation: 0,
                    color: getCSSVariable('--chart-font-color'),
                  },
                  grid: {
                    color: getCSSVariable('--chart-grid-color'),
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: `${t('weight')} (${t('kg')})`,
                    color: getCSSVariable('--chart-font-color'),
                  },
                  ticks: {
                    color: getCSSVariable('--chart-font-color'),
                  },
                  grid: {
                    color: getCSSVariable('--chart-grid-color'),
                  },
                  grace: '10%',
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: t('chartTitle'),
                  color: getCSSVariable('--chart-font-color'),
                },
                tooltip: {
                  enabled: true,
                  displayColors: false,
                  backgroundColor: getCSSVariable('--chart-tooltip-bg'),
                  titleColor: getCSSVariable('--chart-font-color'),
                  bodyColor: getCSSVariable('--chart-font-color'),
                  borderColor: getCSSVariable('--chart-line-color'),
                  borderWidth: 1,
                  callbacks: {
                    title: (tooltipItems) => {
                      const item = tooltipItems[0];
                      const day = item.label;
                      return `${t('day')}: ${day}`;
                    },
                    label: (tooltipItem) => {
                      const value = tooltipItem.formattedValue;
                      return `${t('weight')}: ${value} ${t('kg')}`;
                    },
                  },
                },
                legend: {
                  display: false,
                  position: 'top',
                  labels: {
                    color: getCSSVariable('--chart-font-color'),
                  },
                },
              },
              elements: {
                point: {
                  backgroundColor: getCSSVariable('--chart-line-color'),
                },
              },
            },
          });
        }
      }
    };

    const updateChart = () => {
      if (chartInstance.value) {
        const labels = props.weightData.map((data) => data.day);
        const dataPoints = props.weightData.map((data) => parseFloat(data.weight.toFixed(2)));

        chartInstance.value.data.labels = labels;
        chartInstance.value.data.datasets[0].data = dataPoints;

        chartInstance.value.update();
      }
    };

    const updateChartColors = () => {
      if (chartInstance.value) {
        const options = chartInstance.value.options as ChartOptions<'line'>;
        const dataset = chartInstance.value.data.datasets[0];

        // Update dataset colors
        dataset.borderColor = getCSSVariable('--chart-line-color');
        dataset.pointBackgroundColor = getCSSVariable('--chart-line-color');

        // Update scales and grid colors
        if (options.scales) {
          if (options.scales['x']) {
            const xScale = options.scales['x'];
            if (xScale.title) {
              xScale.title.color = getCSSVariable('--chart-font-color');
            }
            if (xScale.ticks) {
              xScale.ticks.color = getCSSVariable('--chart-font-color');
            }
            if (xScale.grid) {
              xScale.grid.color = getCSSVariable('--chart-grid-color');
            }
          }
          if (options.scales['y']) {
            const yScale = options.scales['y'];
            if (yScale.title) {
              yScale.title.color = getCSSVariable('--chart-font-color');
            }
            if (yScale.ticks) {
              yScale.ticks.color = getCSSVariable('--chart-font-color');
            }
            if (yScale.grid) {
              yScale.grid.color = getCSSVariable('--chart-grid-color');
            }
          }
        }

        // Update plugin colors
        if (options.plugins) {
          if (options.plugins.title) {
            options.plugins.title.color = getCSSVariable('--chart-font-color');
          }

          if (options.plugins.legend && options.plugins.legend.labels) {
            options.plugins.legend.labels.color = getCSSVariable('--chart-font-color');
          }

          if (options.plugins.tooltip) {
            options.plugins.tooltip.backgroundColor = getCSSVariable('--chart-tooltip-bg');
            options.plugins.tooltip.titleColor = getCSSVariable('--chart-font-color');
            options.plugins.tooltip.bodyColor = getCSSVariable('--chart-font-color');
            options.plugins.tooltip.borderColor = getCSSVariable('--chart-line-color');
          }
        }

        chartInstance.value.update();
      }
    };

    const updateChartTranslations = () => {
      if (chartInstance.value) {
        const dataset = chartInstance.value.data.datasets[0];
        dataset.label = t('predictedWeight');

        const options = chartInstance.value.options as ChartOptions<'line'>;

        // Update scales titles
        if (options.scales) {
          if (options.scales['x'] && options.scales['x'].title) {
            options.scales['x'].title.text = t('day');
          }
          if (options.scales['y'] && options.scales['y'].title) {
            options.scales['y'].title.text = `${t('weight')} (${t('kg')})`;
          }
        }

        // Update chart title
        if (options.plugins && options.plugins.title) {
          options.plugins.title.text = t('chartTitle');
        }

        // Update the chart to reflect the changes
        chartInstance.value.update();
      }
    };

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
      () => props.weightData,
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
      chartCanvas,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  height: 350px;
  width: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
