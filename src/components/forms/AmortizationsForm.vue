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
                      type="radio" value="Annual" v-model="amortizationData.amortizationType"/>
               <label class="form-check-label" for="annual"
                      @click="changeAmortizationType('Annual')">
                  Annual amortization
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Number" v-model="amortizationData.amortizationType"/>
               <label class="form-check-label" for="number"
                      @click="changeAmortizationType('Number')">
                  Specific number of amortizations
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Custom" v-model="amortizationData.amortizationType" />
               <label class="form-check-label" for="custom"
                      @click="changeAmortizationType('Custom')">
                  Custom amortization</label>
            </div>
         </div>
         <div v-if="amortizationData.amortizationType == 'Annual'
                 || amortizationData.amortizationType == 'Number'"
              class="annual-amortization-body mt-4">
            <money3 class="form-control text-center" v-bind="amountFormat"
                    v-model="amortizationData.amortizationAmount" placeholder="Amount"/>
         </div>
         <div v-if="amortizationData.amortizationType == 'Number'"
              class="number-amortization-body mt-4">
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
import {
   getYearAmortizationData,
   getNumberAmortizationData,
} from '../../utils/mortgageCalculations';
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
         amortizationData: {
            amortizationType: 'Annual',
            amortizationAmount: '1000',
            amortizationValues: {},
         },
         amortizationValues: '',
         totalAmountAmortizing: 0,
         amountFormat: amountFormat,
      };
   },
   props: {
      mortgageData: {
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
      amortizationData: {
         handler: function() {
            this.calculateActualAmortization();
         },
         deep: true,
      },
   },
   methods: {
      numberToMilesAndCommaFormat,
      numberToMilesFormat,
      yearsFromMonths,
      changeAmortizationType(amortizationType) {
         this.amortizationData.amortizationType = amortizationType;
      },
      calculateActualAmortization() {
         if (this.amortizationData.amortizationType == 'Annual') {
            this.calculateAnnualAmortization();
         } else if (this.amortizationData.amortizationType == 'Number') {
            this.calculateSpecificNumberAmortization();
         }

         this.updateAmortizationData(this.amortizationData);
      },
      calculateAnnualAmortization() {
         const totalAmountYearAmortizationData = getYearAmortizationData(
            this.mortgageData.amount,
            this.mortgageData.TAE,
            this.mortgageData.years,
            parseInt(this.amortizationData.amortizationAmount.replaceAll('.', '')),
         );
         this.totalAmountAmortizing = totalAmountYearAmortizationData.totalAmount,

         this.totalMonthsAmortizing = totalAmountYearAmortizationData.totalMonths;

         this.totalInterest = parseInt(this.totalAmountAmortizing)-
            parseFloat(this.mortgageData.amount);

         this.interestPercentage = ((
            (this.totalAmountAmortizing / this.mortgageData.amount) - 1) * 100
         ).toFixed(2);

         this.interestSaved = (this.mortgageData.totalToPay - this.totalAmountAmortizing);
      },
      calculateSpecificNumberAmortization() {
         const totalAmountYearAmortizationData = getNumberAmortizationData(
            this.mortgageData.amount,
            this.mortgageData.TAE,
            this.mortgageData.years,
            parseInt(this.amortizationData.amortizationAmount.replaceAll('.', '')),
            this.amortizationData.amortizationValues.frequency,
         );
         this.totalAmountAmortizing = totalAmountYearAmortizationData.totalAmount,

         this.totalMonthsAmortizing = totalAmountYearAmortizationData.totalMonths;

         this.totalInterest = parseInt(this.totalAmountAmortizing)-
            parseFloat(this.mortgageData.amount);

         this.interestPercentage = ((
            (this.totalAmountAmortizing / this.mortgageData.amount) - 1) * 100
         ).toFixed(2);

         this.interestSaved = (this.mortgageData.totalToPay - this.totalAmountAmortizing);
      },
      setInitialAmortizationData() {
         this.amortizationData = {
            amortizationType: 'Annual',
            amortizationAmount: this.amortizationData.amortizationAmount,
            amortizationValues: {},
         };
      },
      updateAmortizationData(amortizationData) {
         this.amortizationData = amortizationData;
         this.$emit('retrieveAmortizationData', amortizationData);
      },

   },
   mounted() {
      this.setInitialAmortizationData();
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
