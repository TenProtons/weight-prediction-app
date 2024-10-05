<template>
  <div v-if="show" class="popup-overlay" @click.self="closePopup">
    <div class="popup">
      <button class="close-button" @click="closePopup">&times;</button>
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
  position: relative;
  max-height: 40vh;
  width: 90%;
  max-width: 500px;
  padding: var(--20);
  overflow-y: auto;
  border-radius: var(--border-radius-8);
  background-color: var(--background-color);
}

.close-button {
  position: absolute;
  top: var(--10);
  right: var(--10);
  background: transparent;
  color: var(--text-color);
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.popup-content {
  p {
    color: var(--text-color);
  }
}
</style>
