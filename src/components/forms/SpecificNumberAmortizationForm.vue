<template>
   <div>
      <div class="row mt-3" >
         <div class="col-md-6 text-center"
              v-for="(option, index) in specificOptions" :key="option.value">
            <div v-if="option.numberOfAmmortizations >= 1">
               <button class="btn btn-secondary btn-number-amortization"
                       @click="changeOption(index)"
                       :class="{ 'active': index == selectedOption }">
                  {{ option.numberOfAmmortizations }}
               </button>
               <p class="number-amortization-description">
                  {{ option.description }}
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
      amortization: {
         type: String,
         required: true,
      },
   },
   methods: {
      updateAmortizationData() {
         this.$emit('retrieveAmortizationData', this.amortizationData);
      },
      getSpecificOptions() {
         return [
            {
               frequency: 3,
               numberOfAmmortizations: this.mortgageValues.years * 4,
               description: 'Payment every 3 months',
            },
            {
               frequency: 4,
               numberOfAmmortizations: this.mortgageValues.years * 3,
               description: 'Payment every 4 months',
            },
            {
               frequency: 6,
               numberOfAmmortizations: this.mortgageValues.years * 2,
               description: 'Payment every 6 months',
            },
            {
               frequency: 24,
               numberOfAmmortizations: parseInt(this.mortgageValues.years / 2),
               description: 'Payment every 2 years',
            },
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
