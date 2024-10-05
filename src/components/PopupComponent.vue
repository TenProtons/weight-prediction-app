<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup">
      <div class="popup__popup-header">
        <span>{{ headerText }}</span>
        <button class="close-button" @click="closePopup">&times;</button>
      </div>
      <div class="popup-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PopupComponent',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
    headerText: {
      type: String,
      required: false,
      default: '',
    },
  },
  emits: ['close'],
  setup(props, { emit }) {
    const closePopup = () => {
      emit('close');
    };

    return {
      closePopup,
    };
  },
});
</script>

<style lang="scss" scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  max-height: 40vh;
  width: 90%;
  max-width: 500px;
  overflow-y: auto;
  border-radius: var(--border-radius-8);
  background-color: var(--background-color);

  &__popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--8) var(--12);
    color: var(--text-color);
    border-bottom: 1px solid var(--regular-border-color);
  }
}

.close-button {
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  color: var(--text-color);
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.popup-content {
  display: flex;
  flex-direction: column;
  padding: var(--12) var(--20);
}
</style>
