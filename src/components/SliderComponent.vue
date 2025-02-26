<template>
  <div class="slider-component">
    <label :for="id">{{ label }}</label>
    <div class="slider-component__wrapper">
      <input :id="id" v-model="internalValue" type="range" :min="min" :max="max" :step="step" @input="onInput" />
      <button
        v-if="isManualAdjust"
        class="adjust-button regular-button"
        :disabled="internalValue <= min"
        @click.prevent="decreaseValue"
      >
        &minus;
      </button>
      <span class="value-display">{{ displayValue }}</span>
      <button
        v-if="isManualAdjust"
        class="adjust-button regular-button"
        :disabled="internalValue >= max"
        @click.prevent="increaseValue"
      >
        &plus;
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';

export default defineComponent({
  name: 'SliderComponent',
  props: {
    modelValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    step: {
      type: Number,
      default: 1,
    },
    label: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      default: null,
    },
    isManualAdjust: {
      type: Boolean,
      default: false,
    },
    coefficient: {
      type: Number,
      default: 1,
    },
  },
  emits: ['update:modelValue', 'calculate'],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue);
    let debounceTimeout: ReturnType<typeof setTimeout>;

    const onInput = () => {
      debouncedEmit();
    };

    const increaseValue = () => {
      internalValue.value = Math.min(props.max, internalValue.value + props.step);
      debouncedEmit();
    };

    const decreaseValue = () => {
      internalValue.value = Math.max(props.min, internalValue.value - props.step);
      debouncedEmit();
    };

    const debouncedEmit = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        emit('update:modelValue', internalValue.value);
        emit('calculate');
      }, 300);
    };

    // Watch for changes in modelValue
    watch(
      () => props.modelValue,
      (newVal) => {
        internalValue.value = newVal;
      }
    );

    const displayValue = computed(() => (internalValue.value * props.coefficient).toFixed(1));

    return {
      internalValue,
      decreaseValue,
      increaseValue,
      displayValue,
      onInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.slider-component {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: var(--6);
    font-size: 0.9em;
    text-align: start;
    color: var(--text-color);
  }

  &__wrapper {
    display: flex;
    align-items: center;
    gap: var(--8);
    padding-right: var(--6);
    padding-block: var(--3);
    border: 1px solid var(--regular-border-color);
    border-radius: var(--border-radius-2);

    .value-display {
      min-width: 60px;
      text-align: center;
      font-weight: 700;
      color: var(--slider-value-color);
    }

    .adjust-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--20);
      height: var(--20);
      padding: 0;
      font-size: 1.2em;
      color: var(--button-text-color);
      background-color: var(--button-background);
      border: none;
      border-radius: var(--border-radius-2);
      cursor: pointer;

      &:disabled {
        background-color: var(--button-background-disabled);
        color: var(--button-text-color-disabled);
        cursor: not-allowed;
      }

      &:not(:disabled):hover {
        background-color: var(--button-background-hover);
      }
    }

    input[type='range'] {
      flex: 1;
      border: none;
      -webkit-appearance: none;
      background: transparent;
    }

    /* Custom Slider Track */
    input[type='range']::-webkit-slider-runnable-track {
      height: var(--6);
      background: var(--regular-border-color);
      border-radius: var(--border-radius-4);
    }

    input[type='range']::-moz-range-track {
      height: var(--6);
      background: var(--regular-border-color);
      border-radius: var(--border-radius-4);
    }

    /* Custom Slider Thumb */
    input[type='range']::-webkit-slider-thumb {
      -webkit-appearance: none;
      margin-top: calc(-0.5 * (var(--16) - var(--6)));
      width: var(--16);
      height: var(--16);
      background: var(--active-link-color);
      border-radius: 50%;
      cursor: pointer;
    }

    input[type='range']::-moz-range-thumb {
      width: var(--16);
      height: var(--16);
      background: var(--active-link-color);
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
