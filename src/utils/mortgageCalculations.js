import {
   numberToMilesAndCommaFormat,
   numberToMilesFormat,
} from '../utils/format';

function monthlyPaymentFormula(amount, TAE, years) {
   const i = TAE / 12 / 100;
   const n = years * 12;
   return amount * (((1+i)**n)*i/(((1+i)**n)-1));
}

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

function getAmortizationTableYearAmmortization(amount, TAE, years, ammortizationAmount) {
   if (ammortizationAmount == '') {
      return [];
   }
   const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);
   const i = TAE / 12 / 100;

   let balance = amount;
   let interest = 0;
   let principal = 0;
   const amortizationTable = [];

   let nMonth = 0;
   while (balance > 1) {
      nMonth++;
      interest = balance * i;
      principal = monthlyPayment - interest;

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
         if (balance < ammortizationAmount) {
            ammortizationAmount = balance;
         }
         balance = balance - ammortizationAmount;
         amortizationTable.push({
            month: 'Amortization',
            interest: '-',
            principal: numberToMilesFormat(ammortizationAmount) + ' €',
            monthlyPayment: numberToMilesFormat(ammortizationAmount) + ' €',
            balance: numberToMilesAndCommaFormat(balance) + ' €',
         });
      }
   }
   return amortizationTable;
}

function getAmortizationTableSpecificNumberAmmortization(
   amount,
   TAE,
   years,
   ammortizationAmount,
   ammortizationFrequency,
) {
   if (ammortizationAmount == '') {
      return [];
   }
   const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);
   const i = TAE / 12 / 100;

   let balance = amount;
   let interest = 0;
   let principal = 0;
   const amortizationTable = [];

   let nMonth = 0;
   while (balance > 1) {
      nMonth++;
      interest = balance * i;
      principal = monthlyPayment - interest;

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
         if (balance < ammortizationAmount) {
            ammortizationAmount = balance;
         }
         balance = balance - ammortizationAmount;
         amortizationTable.push({
            month: 'Amortization',
            interest: '-',
            principal: numberToMilesFormat(ammortizationAmount) + ' €',
            monthlyPayment: numberToMilesFormat(ammortizationAmount) + ' €',
            balance: numberToMilesAndCommaFormat(balance) + ' €',
         });
      }
   }
   return amortizationTable;
}

function getTotalAmountYearAmmortization(amount, TAE, years, ammortizationAmount) {
   const monthlyPayment = monthlyPaymentFormula(amount, TAE, years);
   const i = TAE / 12 / 100;

   let balance = amount;
   let interest = 0;
   let principal = 0;

   let totalAmount = 0;

   let nMonth = 0;
   while (balance > 1) {
      nMonth++;
      interest = balance * i;
      principal = monthlyPayment - interest;
      balance = balance - principal;

      totalAmount += monthlyPayment;

      if (nMonth % 12 === 0) {
         if (balance < ammortizationAmount) {
            ammortizationAmount = balance;
         }
         balance = balance - ammortizationAmount;
         totalAmount += ammortizationAmount;
      }
   }
   return {
      'totalAmount': totalAmount,
      'totalMonths': nMonth,
   };
}

export {
   monthlyPaymentFormula,
   getAmortizationTable,
   getAmortizationTableYearAmmortization,
   getTotalAmountYearAmmortization,
};
