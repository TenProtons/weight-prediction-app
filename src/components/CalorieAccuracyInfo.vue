<template>
  <div class="calorie-accuracy-info">
    <button class="regular-button" @click="isPopupVisible = true">?</button>
    <PopupComponent :show="isPopupVisible" @close="isPopupVisible = false">
      <p>This is the content inside the popup.</p>
    </PopupComponent>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import PopupComponent from './PopupComponent.vue';

export default defineComponent({
  name: 'CalorieAccuracyInfo',
  components: {
    PopupComponent,
  },
  setup() {
    const isPopupVisible = ref(false);

    return {
      isPopupVisible,
    };
  },
});
</script>

<style lang="scss" scoped>
.calorie-accuracy-info {
  display: flex;
}
</style>
