import {
   numberToMilesAndCommaFormat,
   numberToMilesFormat,
} from '../utils/format';

function monthlyPaymentFormula(amount, TAE, years) {
   const i = TAE / 12 / 100;
   const n = years * 12;
   return amount * (((1+i)**n)*i/(((1+i)**n)-1));
}

// Amortization table functions
function getAmortizationTable(amount, TAE, years) {
   const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);
   const i = TAE / 12 / 100;
   const n = years * 12;

   let balance = amount;
   let interest = 0;
   let principal = 0;
   const amortizationTable = [];

   for (let j = 0; j < n; j++) {
      interest = balance * i;
      principal = monthlyPayment - interest;
      balance = balance - principal;

      amortizationTable.push({
         month: j + 1,
         interest: numberToMilesAndCommaFormat(interest) + ' €',
         principal: numberToMilesAndCommaFormat(principal) + ' €',
         monthlyPayment: numberToMilesAndCommaFormat(monthlyPayment) + ' €',
         balance: numberToMilesAndCommaFormat(balance) + ' €',
      });
   }
   return amortizationTable;
}

function getYearAmortizationData(amount, TAE, years, amortizationAmount) {
   if (amortizationAmount == '') {
      return [];
   }
   const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);
   const i = TAE / 12 / 100;

   let balance = amount;
   let interest = 0;
   let principal = 0;
   let totalAmount = 0;
   const amortizationTable = [];

   let nMonth = 0;
   while (balance > 1) {
      nMonth++;
      interest = balance * i;
      principal = monthlyPayment - interest;
      totalAmount += monthlyPayment;

      if (interest + principal > balance) {
         principal = balance - interest;
      }

      balance = balance - principal;
      const monthlyPaymentAmount = interest + principal;

      amortizationTable.push({
         month: nMonth,
         interest: numberToMilesAndCommaFormat(interest) + ' €',
         principal: numberToMilesAndCommaFormat(principal) + ' €',
         monthlyPayment: numberToMilesAndCommaFormat(monthlyPaymentAmount) + ' €',
         balance: numberToMilesAndCommaFormat(balance) + ' €',
      });

      if (nMonth % 12 === 0) {
         if (balance < amortizationAmount) {
            amortizationAmount = balance;
         }
         balance = balance - amortizationAmount;
         totalAmount += amortizationAmount;
         amortizationTable.push({
            month: 'Amortization',
            interest: '-',
            principal: numberToMilesFormat(amortizationAmount) + ' €',
            monthlyPayment: numberToMilesFormat(amortizationAmount) + ' €',
            balance: numberToMilesAndCommaFormat(balance) + ' €',
         });
      }
   }
   return {
      'amortizationTable': amortizationTable,
      'totalAmount': totalAmount,
      'totalMonths': nMonth,
   };
}

export {
   monthlyPaymentFormula,
   getAmortizationTable,
   getYearAmortizationData,
};
