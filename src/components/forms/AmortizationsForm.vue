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
                    v-model="amortizationValue" placeholder="Amount"/>
         </div>
         <div v-if="selectedAmortizationType == 'Number'" class="number-amortization-body mt-4">
            <SpecificNumberAmortizationForm
               :mortgageValues="mortgageValues"
               :amortizationValue="amortizationValue"
               @retrieveAmortizationData="updateAmortizationData"
            />
         </div>
         <div class="mt-5" v-if="amortizationValue != '' && totalInterest">
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
               {{ yearsFromMonths(mortgageValues.years * 12) }}
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
} from '../../utils/format';
import SpecificNumberAmortizationForm from './SpecificNumberAmortizationForm.vue';
import {Money3Component} from 'v-money3';
export default {
   name: 'AmortizationsForm',
   data() {
      return {
         selectedAmortizationType: 'Annual',
         amortizationValue: 1000,
         totalAmountAmortizing: 0,
         amountFormat: amountFormat,
      };
   },
   props: {
      mortgageValues: {
         type: Object,
         required: true,
      },
   },
   watch: {
      mortgageValues: {
         handler: function() {
            this.updateTotalAmountAmortizing();
         },
         deep: true,
      },
      selectedAmortizationType: function() {
         this.updateAmortizationData();
      },
      amortizationValue: function() {
         this.updateAmortizationData();
         this.updateTotalAmountAmortizing();
      },
   },
   methods: {
      numberToMilesAndCommaFormat,
      numberToMilesFormat,
      updateAmortizationData() {
         this.$emit('retrieveAmortizationData', {
            amortizationType: this.selectedAmortizationType,
            amortizationValue: this.amortizationValue,
         });
      },
      yearsFromMonths(months) {
         const yearsPart = Math.floor(months / 12) + ' years';
         const monthsPart = ' and ' + months % 12 + ' months';

         if (months % 12 == 0) {
            return yearsPart;
         } else {
            return yearsPart + monthsPart;
         }
      },
      updateTotalAmountAmortizing() {
         const totalAmountYearAmmortizationData = getTotalAmountYearAmmortization(
            this.mortgageValues.amount,
            this.mortgageValues.TAE,
            this.mortgageValues.years,
            parseInt(this.amortizationValue.replaceAll('.', '')),
         );
         this.totalAmountAmortizing = totalAmountYearAmmortizationData.totalAmount,

         this.totalMonthsAmortizing = totalAmountYearAmmortizationData.totalMonths;

         this.totalInterest = parseInt(this.totalAmountAmortizing)-
            parseFloat(this.mortgageValues.amount);

         this.interestPercentage = ((
            (this.totalAmountAmortizing / this.mortgageValues.amount) - 1) * 100
         ).toFixed(2);

         this.interestSaved = (this.mortgageValues.totalToPay - this.totalAmountAmortizing);
      },

   },
   mounted() {
      this.updateTotalAmountAmortizing();
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
