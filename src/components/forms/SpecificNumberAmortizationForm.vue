<template>
   <div>
      <div class="row mt-3" >
         <div class="col-md-6 text-center"
              v-for="(option, index) in specificOptions" :key="option.value">
            <div v-if="option.numberOfAmortizations >= 1">
               <button class="btn btn-secondary btn-number-amortization"
                       @click="changeOption(index)"
                       :class="{ 'active': index == selectedOption }">
                  {{ option.numberOfAmortizations }}
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
import {AMORTIZATIONS_TYPES} from '../../constants/appConstants';
export default {
   name: 'SpecificNumberAmortizationForm',
   data() {
      return {
         specificOptions: this.getSpecificOptions(),
         selectedOption: 0,
      };
   },
   props: {
      mortgageData: {
         type: Object,
         required: true,
      },
      amortizationData: {
         type: Object,
         required: true,
      },
   },
   methods: {
      getSpecificOptions() {
         return [
            {
               frequency: 3,
               numberOfAmortizations: this.mortgageData.years * 4,
               description: 'Payment every 3 months',
            },
            {
               frequency: 4,
               numberOfAmortizations: this.mortgageData.years * 3,
               description: 'Payment every 4 months',
            },
            {
               frequency: 6,
               numberOfAmortizations: this.mortgageData.years * 2,
               description: 'Payment every 6 months',
            },
            {
               frequency: 24,
               numberOfAmortizations: parseInt(this.mortgageData.years / 2),
               description: 'Payment every 2 years',
            },
         ];
      },
      changeOption(index) {
         this.selectedOption = index;
         this.updateAmortizationData({
            amortizationType: AMORTIZATIONS_TYPES.NUMBER,
            amortizationAmount: this.amortizationData.amortizationAmount,
            amortizationValues: {
               frequency: this.specificOptions[index].frequency,
               numberOfAmortizations: this.specificOptions[index].numberOfAmortizations,
            },
         });
      },
      updateAmortizationData(amortizationData) {
         this.$emit('retrieveAmortizationData', amortizationData);
      },
   },
   watch: {
      mortgageData: {
         handler: function() {
            this.specificOptions = this.getSpecificOptions();
         },
         deep: true,
      },
   },
   mounted: function() {
      this.changeOption(0);
   },
   created() {
      this.AMORTIZATIONS_TYPES = AMORTIZATIONS_TYPES;
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
