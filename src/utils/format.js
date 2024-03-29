export const amountFormat= {
   masked: false,
   suffix: ' €',
   thousands: '.',
   precision: 0,
   disableNegative: true,
   allowBlank: true,
   max: 100_000_000,
   shouldRound: true,
   focusOnRight: true,
};

export const TINFormat = {
   suffix: ' %',
   thousands: '.',
   precision: 2,
   disableNegative: true,
   allowBlank: true,
   max: 10,
   shouldRound: true,
   focusOnRight: true,
};

export const yearsFormat = {
   precision: 0,
   disableNegative: true,
   allowBlank: true,
   max: 100,
   shouldRound: true,
   focusOnRight: true,
};

export function numberToMilesAndCommaFormat(number) {
   const parts = number.toFixed(2).toString().split('.');
   const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
   const decimalPart = parts[1];
   return integerPart + ',' + decimalPart;
}

export function numberToMilesFormat(number) {
   const parts = number.toFixed(2).toString().split('.');
   const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
   return integerPart;
}

export function milesAndCommaToNumberFormat(number) {
   return parseFloat(number.replace(/\./g, '').replace(',', '.'));
}

export function yearsFromMonths(months) {
   const yearsPart = Math.floor(months / 12) + ' years';
   const monthsPart = ' and ' + months % 12 + ' months';

   if (months % 12 == 0) {
      return yearsPart;
   } else {
      return yearsPart + monthsPart;
   }
}
