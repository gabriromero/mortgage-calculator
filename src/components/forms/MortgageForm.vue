<template>
   <main>
      <div class="container">
         <div class="text-center">
            <img src="/src/assets/icons/mortgage.svg" alt="logo" width="100" height="100">
         </div>
         <div>
            <h1 class="mb-4 mt-3">Mortgate calculator</h1>

            <div class="form-group row">
               <label for="inputEmail3" class="col-sm-6 col-form-label">Amount</label>
               <div class="col-sm-6">
                  <input class="form-control text-center"
                         v-model="inputAmount" id="inputEmail3" placeholder="Amount">
               </div>
            </div>
            <div class="form-group row">
               <label for="inputPassword3" class="col-sm-6 col-form-label">TAE</label>
               <div class="col-sm-6">
                  <input class="form-control text-center"
                         v-model="inputTAE" id="inputPassword3" placeholder="% TAE">
               </div>
            </div>
            <div class="form-group row">
               <label for="inputPassword3" class="col-sm-6 col-form-label">Years</label>
               <div class="col-sm-6">
                  <input class="form-control text-center" v-model="inputYears"
                         type="number"
                         max="2"
                         placeholder="Years"
                  />
               </div>
            </div>
            <div class="row justify-content-md-center monthly-payment mb-5">
               <div for="inputPassword3">Monthly payment</div>
               <input class="col-sm-9 text-center month-paymeny-input"
                      v-model="monthlyPayment" disabled="true">
            </div>
            <div class="mt-5" v-if="monthlyPayment != '-'">
               <p class="text-center">You will end up paying the bank <b>{{ totalToPay }}€</b></p>
               <p class="text-center">
                  A total of <b>{{ this.totalInterest }}€</b>
                  in interest (<b>{{ this.interestPercentage }}</b>)
               </p>
            </div>
         </div>
      </div>
   </main>
</template>

<script>
import {monthlyPaymentFormula} from '../../utils/mortgageCalculations';
export default {
   name: 'MortgageForm',
   data() {
      return {
         inputAmount: '100.000',
         inputTAE: '3.5',
         inputYears: '30',
         monthlyPayment: '-',
         totalToPay: 0,
         totalInterest: 0,
      };
   },
   watch: {
      inputAmount: function(input) {
         this.inputAmount = input.replace(/\D/g, '')
            .replace(/\B(?=(\d{3})+(?!\d)\.?)/g, '.');

         const maxAmountLength = 10;
         if (this.inputAmount.length > maxAmountLength) {
            this.inputAmount = this.inputAmount.substring(0, maxAmountLength);
         }

         this.calculateMonthlyPayment();
      },
      inputTAE: function(input) {
         const cleanedInput = input.replace(/\D/g, '');

         if (cleanedInput.length > 0) {
            let formattedInput = cleanedInput[0];
            if (cleanedInput.length > 1) {
               formattedInput += '.' + cleanedInput.slice(1, cleanedInput.length);
            }
            this.inputTAE = formattedInput;
         } else {
            this.inputTAE = '';
         }

         this.calculateMonthlyPayment();
      },
      inputYears: function() {
         const maxYears = 99;
         if (this.inputYears > maxYears) {
            this.inputYears = maxYears;
         }
         this.calculateMonthlyPayment();
      },
   },
   methods: {
      calculateMonthlyPayment() {
         const amount = parseInt(this.inputAmount.replaceAll('.', ''));
         const TAE = parseFloat(this.inputTAE);
         const years = this.inputYears;

         if (this.inputAmount == '' || this.inputTAE == '' ||
            this.inputYears == '' || TAE === 0) {
            this.monthlyPayment = '-';
            return;
         }

         const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);

         this.monthlyPayment = this.milesAndCommaFormat(monthlyPayment) + ' €';

         this.totalToPay = this.milesAndCommaFormat(monthlyPayment * years * 12);

         this.totalInterest = this.milesAndCommaFormat(monthlyPayment * years * 12 - amount);

         this.interestPercentage = (
            (monthlyPayment * years * 12 - amount) / amount * 100)
            .toFixed(2) + '%';

         this.updateMortgageValues({
            amount,
            TAE,
            years,
            'totalToPay': parseFloat(this.totalToPay.replace(/\./g, '')),
         });
      },
      milesAndCommaFormat(number) {
         const parts = number.toFixed(2).toString().split('.');
         const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
         const decimalPart = parts[1];
         return integerPart + ',' + decimalPart;
      },
      updateMortgageValues(mortgageValues) {
         this.$emit('retrieveMortgageValues', mortgageValues);
      },
   },
   mounted() {
      this.calculateMonthlyPayment();
   },
};
</script>

<style scoped>

main {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
@media (min-width: 50em){
    .container{
        max-width: 40em;
    }
}

.form-group{
    margin-bottom: 1em;
}

.monthly-payment{
    text-align: center;
    margin-top: 3em;
}

.month-paymeny-input{
    background-color: white;
}

</style>
