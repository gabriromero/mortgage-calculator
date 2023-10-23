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
               <label class="form-check-label" for="annual">
                  Annual amortization
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Number" v-model="selectedAmortizationType"/>
               <label class="form-check-label" for="number">
                  Specific number of amortizations
               </label>
            </div>
            <div class="form-check form-check-inline">
               <input class="form-check-input"
                      type="radio" value="Custom" v-model="selectedAmortizationType" />
               <label class="form-check-label" for="custom">Custom amortization</label>
            </div>
         </div>
         <div v-if="selectedAmortizationType == 'Annual'" class="annual-amortization-body mt-4">
            <input class="form-control text-center"
                   v-model="amortizationValue" id="inputEmail3" placeholder="Annual amount">
         </div>
         <div v-if="selectedAmortizationType == 'Number'" class="number-amortization-body mt-4">
            <input class="form-control text-center"
                   v-model="amortizationValue" id="inputEmail3" placeholder="Payment amount">
            <div class="row mt-3">
               <div class="col-md-6 text-center">
                  <button class="btn btn-secondary btn-number-amortization">5</button>
                  <p class="number-amortization-description">
                     Payment every 6 years
                  </p>
               </div>
               <div class="col-md-6 text-center">
                  <button class="btn btn-secondary btn-number-amortization">10</button>
                  <p class="number-amortization-description">
                     Payment every 3 years
                  </p>
               </div>
            </div>
            <div class="row">
               <div class="col-md-6 text-center">
                  <button class="btn btn-secondary btn-number-amortization">15</button>
                  <p class="number-amortization-description">
                     Payment every 2 years
                  </p>
               </div>
               <div class="col-md-6 text-center">
                  <button class="btn btn-secondary btn-number-amortization">60</button>
                  <p class="number-amortization-description">
                     Payment every 6 months
                  </p>
               </div>
            </div>
         </div>
         <div class="mt-5" v-if="amortizationValue != ''">
            <p class="text-center">
               You will end up paying the bank
               <b>{{ milesAndCommaFormat(parseFloat(totalAmountAmortizing)) }}€</b>
            </p>
            <p class="text-center">
               A total of
               <b>{{ milesAndCommaFormat((totalAmountAmortizing-mortgageValues.amount)) }}€</b>
               in interest (
               <b>
                  {{ (((totalAmountAmortizing / mortgageValues.amount) - 1) * 100).toFixed(2) }}%
               </b>
               )
            </p>
            <p class="text-center">
               Total interest saved:
               <span class="text-success">
                  {{ milesAndCommaFormat((mortgageValues.totalToPay - totalAmountAmortizing))}}€
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
export default {
   name: 'AmortizationsForm',
   data() {
      return {
         selectedAmortizationType: 'Annual',
         amortizationValue: '',
         totalAmountAmortizing: 0,
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
            this.updateToTalAmountAmortizing();
         },
         deep: true,
      },
      amortizationValue: function(input) {
         this.amortizationValue = input.replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, '.');

         const maxAmountLength = 9;
         if (this.amortizationValue.length > maxAmountLength) {
            this.amortizationValue = this.amortizationValue.slice(0, maxAmountLength);
         }

         if (this.amortizationValue.length > 0) {
            this.updateAmortizationData();
         }

         this.updateToTalAmountAmortizing();
      },
      selectedAmortizationType: function() {
         this.updateAmortizationData();
      },
   },
   methods: {
      updateAmortizationData() {
         this.$emit('retrieveAmortizationData', {
            amortizationType: this.selectedAmortizationType,
            amortizationValue: this.amortizationValue,
         });
      },
      milesAndCommaFormat(number) {
         const parts = number.toFixed(2).toString().split('.');
         const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
         const decimalPart = parts[1];
         return integerPart + ',' + decimalPart;
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
      updateToTalAmountAmortizing() {
         const totalAmountYearAmmortizationData = getTotalAmountYearAmmortization(
            this.mortgageValues.amount,
            this.mortgageValues.TAE,
            this.mortgageValues.years,
            parseInt(this.amortizationValue.replaceAll('.', '')),
         );

         this.totalAmountAmortizing = totalAmountYearAmmortizationData.totalAmount;
         this.totalMonthsAmortizing = totalAmountYearAmmortizationData.totalMonths;
      },

   },
   mounted() {
      this.updateAmortizationData();
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
