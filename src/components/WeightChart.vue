<template>
  <div>
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref, shallowRef, watch, PropType } from 'vue';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: 'WeightChart',
  props: {
    weightData: {
      type: Array as PropType<Array<{ day: number; weight: number }>>,
      required: true,
    },
  },
  setup(props) {
    const chartInstance = shallowRef<Chart | null>(null);
    const chartCanvas = ref<HTMLCanvasElement | null>(null);

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
                  borderColor: 'rgba(75,192,192,1)',
                  tension: 0.1,
                  pointRadius: function (context) {
                    const index = context.dataIndex;
                    const xScale = context.chart.scales.x;
                    const displayedTicks = xScale.ticks;

                    // Create a set of displayed tick indices for efficient lookup
                    const displayedTickIndices = new Set(displayedTicks.map((tick) => tick.value));

                    // Show point if its index is in the set of displayed tick indices
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
                  },
                  ticks: {
                    maxTicksLimit: 20,
                    autoSkip: true,
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Weight (kg)',
                  },
                  grace: '10%',
                },
              },
              plugins: {
                title: {
                  display: true,
                  text: 'Predicted Weight Over Time',
                },
                tooltip: {
                  enabled: true,
                },
                legend: {
                  display: false,
                  position: 'top',
                },
              },
            },
          });
        }
      }
    };

    const updateChart = () => {
      if (chartInstance.value) {
        // Create new arrays to avoid mutating reactive data
        const labels = props.weightData.map((data) => data.day);
        const dataPoints = props.weightData.map((data) => parseFloat(data.weight.toFixed(2)));

        chartInstance.value.data.labels = labels;
        chartInstance.value.data.datasets[0].data = dataPoints;

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
div {
  position: relative;
  height: 400px;
  width: 100%;
}
</style>
