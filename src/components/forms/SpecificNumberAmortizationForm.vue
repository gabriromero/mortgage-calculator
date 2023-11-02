<template>
   <div>
      <div class="row mt-3" >
         <div class="col-md-6 text-center"
              v-for="(option, index) in specificOptions" :key="option.value">
            <div v-if="option.value >= 1">
               <button class="btn btn-secondary btn-number-amortization"
                       @click="changeOption(index)"
                       :class="{ 'active': index == selectedOption }">
                  {{ option.value }}
               </button>
               <p class="number-amortization-description">
                  {{ option.text }}
               </p>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   name: 'SpecificNumberAmortizationForm',
   data() {
      return {
         specificOptions: this.getSpecificOptions(),
         selectedOption: 0,
      };
   },
   props: {
      mortgageValues: {
         type: Object,
         required: true,
      },
      amortizationValue: {
         type: String,
         required: true,
      },
   },
   methods: {
      updateAmortizationData() {
         this.$emit('retrieveAmortizationData', this.amortizationValue);
      },
      getSpecificOptions() {
         return [
            {text: 'Payment every 3 months', value: this.mortgageValues.years * 4},
            {text: 'Payment every 4 months', value: this.mortgageValues.years * 3},
            {text: 'Payment every 6 months', value: this.mortgageValues.years * 2},
            {text: 'Payment every 2 years', value: parseInt(this.mortgageValues.years / 2)},
         ];
      },
      changeOption(index) {
         this.selectedOption = index;
         this.updateAmortizationData();
      },
   },
   watch: {
      mortgageValues: {
         handler: function() {
            this.specificOptions = this.getSpecificOptions();
         },
         deep: true,
      },
   },
};
</script>

<style>
.active {
   background-color: #4278a7 !important;
   color: white !important;
   border-color: #4278a7 !important;
}
</style>
