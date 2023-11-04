<template>
   <div class="p-2">
      <OptionsTab @change-mode="updateMode" />
   </div>
   <div>
      <div class="container">
         <div class="row justify-content-md-center">
            <div class="col col-lg-6">
               <MortgageForm @retrieveMortgageData="updateMortgageData" />
            </div>
            <div v-if="isAdvanced" class="col col-lg-6">
               <AmortizationsForm
                  @retrieveAmortizationData="updateAmortizationData"
                  :mortgageData="mortgageData"
                  :amortizationData="amortizationData"
               />
            </div>
         </div>
      </div>
   </div>
   <div class="container text-center mt-4 pb-5">
      <h3>Amortization Table</h3>
      <AmortizationTable
         :isAdvanced="isAdvanced"
         :mortgageData="mortgageData"
         :amortizationData="amortizationData"
      />
   </div>
</template>

<script>
import OptionsTab from './components/OptionsTab.vue';
import AmortizationTable from './components/AmortizationTable.vue';
import MortgageForm from './components/forms/MortgageForm.vue';
import AmortizationsForm from './components/forms/AmortizationsForm.vue';

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
         mortgageData: {},
         amortizationData: {},
      };
   },
   methods: {
      updateMode(mode) {
         this.isAdvanced = mode === 'advanced' ? true : false;
      },
      updateMortgageData: function(mortgageData) {
         this.mortgageData = mortgageData;
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
