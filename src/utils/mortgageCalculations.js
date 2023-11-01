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
         interest: interest.toFixed(2) + ' €',
         principal: principal.toFixed(2) + ' €',
         monthlyPayment: monthlyPayment.toFixed(2) + ' €',
         balance: balance.toFixed(2) + ' €',
      });
   }
   return amortizationTable;
}

function getAmortizationTableYearAmmortization(amount, TAE, years, yearAmmortization) {
   if (yearAmmortization == '') {
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

      amortizationTable.push({
         month: nMonth,
         interest: interest.toFixed(2) + ' €',
         principal: principal.toFixed(2) + ' €',
         monthlyPayment: (interest + principal).toFixed(2) + ' €',
         balance: balance.toFixed(2) + ' €',
      });

      if (nMonth % 12 === 0) {
         if (balance < yearAmmortization) {
            yearAmmortization = balance;
         }
         balance = balance - yearAmmortization;
         amortizationTable.push({
            month: 'Amortization',
            interest: '-',
            principal: yearAmmortization.toFixed(2) + ' €',
            monthlyPayment: yearAmmortization.toFixed(2) + ' €',
            balance: balance.toFixed(2) + ' €',
         });
      }
   }
   return amortizationTable;
}

function getTotalAmountYearAmmortization(amount, TAE, years, yearAmmortization) {
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
         if (balance < yearAmmortization) {
            yearAmmortization = balance;
         }
         balance = balance - yearAmmortization;
         totalAmount += yearAmmortization;
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
