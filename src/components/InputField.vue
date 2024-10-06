<template>
  <div class="input-field">
    <label :for="id">{{ label }}</label>
    <input :id="id" v-model="inputValue" v-bind="inputProps" @input="handleInput" />
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'InputField',
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'text',
    },
    error: String,
    id: String,
    required: {
      type: Boolean,
      default: false,
    },
    min: {
      type: [String, Number],
      default: null,
    },
    max: {
      type: [String, Number],
      default: null,
    },
    maxlength: {
      type: [String, Number],
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        const newValue = props.type === 'number' ? (value === '' ? '' : Number(value)) : value;
        emit('update:modelValue', newValue);
      },
    });

    const inputProps = computed(() => {
      const attrs: Record<string, any> = {
        required: props.required,
        type: props.type,
      };

      if (props.min !== null && props.min !== undefined) {
        attrs.min = props.min;
      }

      if (props.max !== null && props.max !== undefined) {
        attrs.max = props.max;
      }

      if (props.maxlength !== null && props.maxlength !== undefined) {
        attrs.maxlength = props.maxlength;
      }

      return attrs;
    });

    const handleInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      if (props.maxlength && input.value.length > Number(props.maxlength)) {
        input.value = input.value.slice(0, Number(props.maxlength));
        inputValue.value = input.value;
      }
    };

    return {
      inputValue,
      inputProps,
      handleInput,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  flex-direction: column;

  /* Hide spinners in WebKit browsers (Chrome, Safari, Edge, Opera) */
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Hide spinners in Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
}
</style>
