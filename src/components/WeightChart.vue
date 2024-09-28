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
              labels: props.weightData.map((data) => `Day ${data.day}`),
              datasets: [
                {
                  label: 'Predicted Weight',
                  data: props.weightData.map((data) => Number(data.weight.toFixed(2))),
                  fill: false,
                  borderColor: 'rgba(75,192,192,1)',
                  tension: 0.1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Day',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Weight (kg)',
                  },
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
                  display: true,
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
        const labels = props.weightData.map((data) => `Day ${data.day}`);
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
