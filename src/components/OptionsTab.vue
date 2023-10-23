<template>
   <main>
      <span :class="{ 'selected-option': !isAdvanced }" class="option-button"
            @click="setMode('simple')">Simple</span>
      <span :class="{ 'selected-option': isAdvanced }" class="option-button"
            @click="setMode('advanced')">Amortizing</span>
   </main>
</template>

<script>
export default {
   name: 'OptionsTab',
   data() {
      return {
         isAdvanced: false,
      };
   },
   methods: {
      setMode(mode) {
         this.isAdvanced = mode === 'advanced' ? true : false;
         this.$emit('change-mode', mode);
      },
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
