<template>
  <div class="p-2">
    <Options @change-mode="updateMode"/>
  </div>
  <div>
  </div>
  <div v-if="!this.isAdvanced">
    <main>
      <Calculator @retrieveMortgageValues="updateMortgageValues" />
    </main>
  </div>
  <div v-else>
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col col-lg-6">
          <Calculator @retrieveMortgageValues="updateMortgageValues"/>
        </div>
        <div class="col col-lg-6">
          <Amortizations @retrieveAmortizationData="updateAmortizationData" :mortgageValues="mortgageValues"/>
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
        :amortizationData="amortizationData"/>
    </div>
  </div>
</template>


<script>
  import Calculator from './components/Calculator.vue'
  import Options from './components/Options.vue'
  import Amortizations from './components/Amortizations.vue'
  import AmortizationTable from './components/AmortizationTable.vue'

  export default {
    components: {
    Calculator,
    Options,
    Amortizations,
    AmortizationTable
},
    data() {
      return{
        isAdvanced: false,
        mortgageValues: {},
        amortizationData: {}
      }
    },
    methods: {
      updateMode(mode) {
        this.isAdvanced = mode === 'advanced' ? true : false;
      },
      updateMortgageValues: function(mortgageValues) {
        this.mortgageValues = mortgageValues
      },
      updateAmortizationData: function(amortizationData) {
        this.amortizationData = amortizationData
        console.log(this.amortizationData);
      }
    }
  }
  
</script>

<style scoped>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
  }

</style>
