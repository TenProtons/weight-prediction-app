<template>
  <div class="select-field">
    <label :for="id">{{ label }}</label>
    <select :id="id" v-model="selectValue" v-bind="selectProps">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'SelectField',
  props: {
    modelValue: {
      type: [String, Number],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    options: {
      type: Array as () => Array<{ value: string | number; label: string }>,
      required: true,
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
    const selectValue = computed({
      get() {
        return props.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });

    const selectProps = computed(() => {
      return {
        required: props.required,
      };
    });

    return {
      selectValue,
      selectProps,
    };
  },
});
</script>

<style scoped>
.select-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  margin-bottom: 5px;
}

.error {
  color: red;
  font-size: 0.8em;
}
</style>
