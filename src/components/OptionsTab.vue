<template>
   <main>
      <span :class="{ 'selected-option': mode === this.MODES.SIMPLE }" class="option-button"
            @click="setMode(this.MODES.SIMPLE)">Simple</span>
      <span :class="{ 'selected-option': mode === this.MODES.AMORTIZING }" class="option-button"
            @click="setMode(this.MODES.AMORTIZING)">Amortizing</span>
   </main>
</template>

<script>
import {MODES} from '../constants/appConstants';

export default {
   name: 'OptionsTab',
   data() {
      return {
         mode: MODES.SIMPLE,
      };
   },
   methods: {
      setMode(mode) {
         this.mode = mode;
         this.$emit('change-mode', mode);
      },
   },
   created() {
      this.MODES = MODES;
   },
};
</script>

<style scoped>
main {
  display: flex;
  justify-content: center;
  align-items: center;
}

.option-button {
  margin: 0 10px;
  cursor: pointer;
}

.selected-option {
  color: #007bff;
}
</style>
