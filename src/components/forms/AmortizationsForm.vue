<template>
   <main>
      <div class="container">
         <div class="text-center">
            <img src="/src/assets/icons/amortization.svg" alt="logo" width="100" height="100">
         </div>
         <h1 class="mb-4 mt-3">Planned amortizations</h1>
         <div class="amortizations-options d-flex flex-column">
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Annual" v-model="selectedAmortizationType"/>
               <label class="form-check-label" for="annual"
                      @click="selectedAmortizationType = 'Annual'">
                  Annual amortization
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Number" v-model="selectedAmortizationType"/>
               <label class="form-check-label" for="number"
                      @click="selectedAmortizationType = 'Number'">
                  Specific number of amortizations
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Custom" v-model="selectedAmortizationType" />
               <label class="form-check-label" for="custom"
                      @click="selectedAmortizationType = 'Custom'">
                  Custom amortization</label>
            </div>
         </div>
         <div v-if="selectedAmortizationType == 'Annual' || selectedAmortizationType == 'Number'"
              class="annual-amortization-body mt-4">
            <money3 class="form-control text-center" v-bind="amountFormat"
                    v-model="amortizationAmount" placeholder="Amount"/>
         </div>
         <div v-if="selectedAmortizationType == 'Number'" class="number-amortization-body mt-4">
            <SpecificNumberAmortizationForm
               :mortgageData="mortgageData"
               :amortizationData="amortizationData"
               @retrieveAmortizationData="updateAmortizationData"
            />
         </div>
         <div class="mt-5" v-if="amortizationData != '' && totalInterest">
            <p class="text-center">
               You will end up paying the bank
               <b>{{ numberToMilesAndCommaFormat(this.totalAmountAmortizing) }}€</b>
            </p>
            <p class="text-center">
               A total of
               <b>{{ numberToMilesAndCommaFormat(this.totalInterest) }}€</b>
               in interest (
               <b>
                  {{ this.interestPercentage }}%
               </b>
               )
            </p>
            <p class="text-center">
               Total interest saved:
               <span class="text-success">
                  {{ numberToMilesFormat(this.interestSaved) }}€
               </span></p>
            <p class="text-center">Months reduced from:</p>
            <p>
               {{ yearsFromMonths(mortgageData.years * 12) }}
               ➡️
               {{ yearsFromMonths(this.totalMonthsAmortizing) }}
            </p>

         </div>
      </div>
   </main>
</template>

<script>
import {getTotalAmountYearAmmortization} from '../../utils/mortgageCalculations';
import {
   amountFormat,
   numberToMilesAndCommaFormat,
   numberToMilesFormat,
   yearsFromMonths,
} from '../../utils/format';
import SpecificNumberAmortizationForm from './SpecificNumberAmortizationForm.vue';
import {Money3Component} from 'v-money3';
export default {
   name: 'AmortizationsForm',
   data() {
      return {
         selectedAmortizationType: 'Annual',
         amortizationData: '',
         amortizationAmount: 1000,
         totalAmountAmortizing: 0,
         amountFormat: amountFormat,
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
   watch: {
      mortgageData: {
         handler: function() {
            this.calculateActualAmortization();
         },
         deep: true,
      },
      amortizationAmount: function() {
         this.calculateActualAmortization();
      },
   },
   methods: {
      numberToMilesAndCommaFormat,
      numberToMilesFormat,
      yearsFromMonths,
      calculateActualAmortization() {
         if (this.selectedAmortizationType == 'Annual') {
            this.calculateAnnualAmortization();
            this.amortizationData = this.amortizationAmount;
         } else if (this.selectedAmortizationType == 'Number') {
            this.calculateSpecificNumberAmortization();
         }
         debugger;
         this.updateAmortizationData();
      },
      updateAmortizationData() {
         this.$emit('retrieveAmortizationData', {
            amortizationType: this.selectedAmortizationType,
            amortizationData: this.amortizationData,
         });
      },
      calculateAnnualAmortization() {
         const totalAmountYearAmmortizationData = getTotalAmountYearAmmortization(
            this.mortgageData.amount,
            this.mortgageData.TAE,
            this.mortgageData.years,
            parseInt(this.amortizationAmount.replaceAll('.', '')),
         );
         this.totalAmountAmortizing = totalAmountYearAmmortizationData.totalAmount,

         this.totalMonthsAmortizing = totalAmountYearAmmortizationData.totalMonths;

         this.totalInterest = parseInt(this.totalAmountAmortizing)-
            parseFloat(this.mortgageData.amount);

         this.interestPercentage = ((
            (this.totalAmountAmortizing / this.mortgageData.amount) - 1) * 100
         ).toFixed(2);

         this.interestSaved = (this.mortgageData.totalToPay - this.totalAmountAmortizing);
      },
      calculateSpecificNumberAmortization() {
         alert('Not implemented yet');
         this.amortizationData = {
            amortizationAmount: 0,
            numberOfAmmortizations: 60,
         };
      },

   },
   mounted() {
      this.calculateActualAmortization();
   },
   components: {
      money3: Money3Component,
      SpecificNumberAmortizationForm,
   },

};
</script>

<style>
main {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.amortizations-options {
    width: 60%;
    margin: 0 auto;
}
.annual-amortization-body {
    width: 70%;
    margin: 0 auto;
}
.number-amortization-body {
    width: 55%;
    margin: 0 auto;
}
.btn-number-amortization{
    width: 70%;
    border-radius: 5%;
    font-size: 22px;
    margin: 5px;
}
.number-amortization-description{
    font-size: 11px;
    margin: 0;
}
</style>
