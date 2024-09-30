<template>
  <div class="input-field">
    <label :for="id">{{ label }}</label>
    <input :id="id" v-model="inputValue" :type="type" v-bind="inputProps" />
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
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        const newValue = props.type === 'number' ? Number(value) : value;
        emit('update:modelValue', newValue);
      },
    });

    const inputProps = computed(() => {
      return {
        required: props.required,
      };
    });

    return {
      inputValue,
      inputProps,
    };
  },
});
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
  }
}
</style>
