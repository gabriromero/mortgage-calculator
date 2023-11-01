<template>
   <div class="p-2">
      <OptionsTab @change-mode="updateMode" />
   </div>
   <div>
      <div class="container">
         <div class="row justify-content-md-center">
            <div class="col col-lg-6">
               <MortgageForm @retrieveMortgageValues="updateMortgageValues" />
            </div>
            <div v-if="isAdvanced" class="col col-lg-6">
               <AmortizationsForm
                  @retrieveAmortizationData="updateAmortizationData"
                  :mortgageValues="mortgageValues"
               />
            </div>
         </div>
      </div>
   </div>
   <div>
      <div class="container text-center mt-4">
         <h3>Amortization Table</h3>
         <AmortizationTable
            :isAdvanced="isAdvanced"
            :mortgageValues="mortgageValues"
            :amortizationData="amortizationData"
         />
      </div>
   </div>
</template>

<script>
import MortgageForm from './components/forms/MortgageForm.vue';
import OptionsTab from './components/OptionsTab.vue';
import AmortizationsForm from './components/forms/AmortizationsForm.vue';
import AmortizationTable from './components/AmortizationTable.vue';

export default {
   components: {
      MortgageForm,
      OptionsTab,
      AmortizationsForm,
      AmortizationTable,
   },
   data() {
      return {
         isAdvanced: false,
         mortgageValues: {},
         amortizationData: {},
      };
   },
   methods: {
      updateMode(mode) {
         this.isAdvanced = mode === 'advanced' ? true : false;
      },
      updateMortgageValues: function(mortgageValues) {
         this.mortgageValues = mortgageValues;
      },
      updateAmortizationData: function(amortizationData) {
         this.amortizationData = amortizationData;
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
</style>
