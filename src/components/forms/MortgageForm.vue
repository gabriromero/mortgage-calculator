<template>
   <main>
      <div class="container">
         <div class="text-center">
            <img src="/src/assets/icons/mortgage.svg" alt="logo" width="100" height="100">
         </div>
         <div>
            <h1 class="mb-4 mt-3">Mortgage calculator</h1>

            <div class="form-group row">
               <label for="inputEmail3" class="col-sm-6 col-form-label">Amount</label>
               <div class="col-sm-6">
                  <money3 class="form-control text-center" v-bind="amountFormat"
                          v-model="inputAmount" id="inputEmail3" placeholder="Amount"/>
               </div>
            </div>
            <div class="form-group row">
               <label for="inputPassword3" class="col-sm-6 col-form-label">Annual interest</label>
               <div class="col-sm-6">
                  <money3 class="form-control text-center" v-bind="TINFormat"
                          v-model="inputTIN" id="inputPassword3" placeholder="% TIN"/>
               </div>
            </div>
            <div class="form-group row">
               <label for="inputPassword3" class="col-sm-6 col-form-label">Years</label>
               <div class="col-sm-6">
                  <money3 class="form-control text-center" v-bind="yearsFormat"
                          v-model="inputYears"
                          type="number"
                          placeholder="Years"
                  />
               </div>
            </div>
            <div class="row justify-content-md-center monthly-payment mb-5">
               <div for="inputPassword3">Monthly payment</div>
               <input class="col-sm-9 text-center month-paymeny-input"
                      v-model="formattedMonthlyPayment" disabled="true">
            </div>
            <div class="mt-5" v-if="monthlyPayment != '-'">
               <p class="text-center">
                  You will end up paying the bank <b>{{ formattedTotalToPay }}€</b>
               </p>
               <p class="text-center">
                  A total of <b>{{ formattedTotalInterest }}€</b>
                  in interest (<b>{{ interestPercentage }}</b>)
               </p>
            </div>
         </div>
      </div>
   </main>
</template>

<script>
import {monthlyPaymentFormula} from '../../utils/mortgageCalculations';
import {
   amountFormat,
   TINFormat,
   yearsFormat,
   numberToMilesAndCommaFormat,
} from '../../utils/format';
import {Money3Component} from 'v-money3';
export default {
   name: 'MortgageForm',
   data() {
      return {
         inputAmount: '100000',
         inputTIN: '3.50',
         inputYears: '30',
         monthlyPayment: 0,
         totalToPay: 0,
         totalInterest: 0,
         amountFormat: amountFormat,
         TINFormat: TINFormat,
         yearsFormat: yearsFormat,
      };
   },
   computed: {
      formattedMonthlyPayment() {
         return numberToMilesAndCommaFormat(this.monthlyPayment) + '€';
      },
      formattedTotalToPay() {
         return numberToMilesAndCommaFormat(this.totalToPay);
      },
      formattedTotalInterest() {
         return numberToMilesAndCommaFormat(this.totalInterest);
      },
   },
   watch: {
      inputAmount: function() {
         this.calculateMonthlyPayment(this.inputAmount, this.inputTIN, this.inputYears);
         this.updateURLParams();
      },
      inputTIN: function() {
         this.calculateMonthlyPayment(this.inputAmount, this.inputTIN, this.inputYears);
         this.updateURLParams();
      },
      inputYears: function() {
         this.calculateMonthlyPayment(this.inputAmount, this.inputTIN, this.inputYears);
         this.updateURLParams();
      },
   },
   methods: {
      calculateMonthlyPayment(amount, TIN, years) {
         const monthlyPayment = monthlyPaymentFormula(amount, TIN, years);

         this.monthlyPayment = monthlyPayment;
         this.totalToPay = monthlyPayment * years * 12;
         this.totalInterest = monthlyPayment * years * 12 - amount;

         this.interestPercentage = (
            (monthlyPayment * years * 12 - amount) / amount * 100)
            .toFixed(2) + '%';

         this.updateMortgageData({
            amount,
            TIN,
            years,
            'totalToPay': this.totalToPay,
         });
      },
      updateMortgageData(mortgageData) {
         this.$emit('retrieveMortgageData', mortgageData);
      },
      getQueryParams() {
         const params = {};
         const queryString = window.location.href.split('?')[1];
         if (queryString) {
            const pairs = queryString.split('&');
            pairs.forEach(pair => {
               const [key, value] = pair.split('=');
               params[decodeURIComponent(key)] = decodeURIComponent(value);
            });
         }
         return params;
      },
      updateURLParams() {
         const params = new URLSearchParams();
         params.set('amount', this.inputAmount);
         params.set('tin', this.inputTIN.replace('.', ''));
         params.set('years', this.inputYears);
         const newUrl = `${window.location.pathname}?${params.toString()}`;
         window.history.replaceState({}, '', newUrl);
      },
   },
   mounted() {
      const params = this.getQueryParams();
      if (params.amount) {
         this.inputAmount = params.amount;
      }
      if (params.tin) {
         this.inputTIN = params.tin;
      }
      if (params.years) {
         this.inputYears = params.years;
      }
      this.calculateMonthlyPayment(this.inputAmount, this.inputTIN, this.inputYears);
   },
   components: {
      money3: Money3Component,
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
