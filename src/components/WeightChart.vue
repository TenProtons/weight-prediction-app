<template>
  <div class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, shallowRef, watch, PropType } from 'vue';
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
                  label: 'Predicted Weight',
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
                    text: 'Day',
                    color: getCSSVariable('--chart-font-color'),
                  },
                  ticks: {
                    maxTicksLimit: 20,
                    autoSkip: true,
                    color: getCSSVariable('--chart-font-color'),
                  },
                  grid: {
                    color: getCSSVariable('--chart-grid-color'),
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Weight (kg)',
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
                  text: 'Predicted Weight Over Time',
                  color: getCSSVariable('--chart-font-color'),
                },
                tooltip: {
                  enabled: true,
                  backgroundColor: getCSSVariable('--chart-tooltip-bg'),
                  titleColor: getCSSVariable('--chart-font-color'),
                  bodyColor: getCSSVariable('--chart-font-color'),
                  borderColor: getCSSVariable('--chart-line-color'),
                  borderWidth: 1,
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
        const getCSSVariable = (name: string) =>
          getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        const options = chartInstance.value.options as ChartOptions<'line'>;
        const dataset = chartInstance.value.data.datasets[0];

        // Update dataset colors
        dataset.borderColor = getCSSVariable('--chart-line-color');
        dataset.pointBackgroundColor = getCSSVariable('--chart-line-color');

        // Update scales and grid colors
        if (options.scales && options.scales.x && options.scales.y) {
          const xScale = options.scales.x;
          const yScale = options.scales.y;

          if (xScale) {
            xScale.title!.color = getCSSVariable('--chart-font-color');
            xScale.ticks!.color = getCSSVariable('--chart-font-color');
            xScale.grid!.color = getCSSVariable('--chart-grid-color');
          }

          if (yScale) {
            yScale.title!.color = getCSSVariable('--chart-font-color');
            yScale.ticks!.color = getCSSVariable('--chart-font-color');
            yScale.grid!.color = getCSSVariable('--chart-grid-color');
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

    return {
      chartCanvas,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
