<template>
   <div>
      <table class="zebra-table">
         <tr>
            <th class="w-5">
               <b>Month number</b>
            </th>
            <th class="w-10">
               <b>Interests</b>
            </th>
            <th class="w-10">
               <b>Amortization</b>
            </th>
            <th class="w-10">
               <b>Total payment</b>
            </th>
            <th class="w-10">
               <b>Pending</b>
            </th>
         </tr>
         <tr v-for="(amortizationMonth, index) in amortizationTable"
             :key="amortizationMonth"
             :class="{ 'even-row': index % 2 === 0, 'odd-row': index % 2 !== 0 }">
            <th v-for="amortizationMonthValue in amortizationMonth"
                :key="amortizationMonthValue">
               {{ amortizationMonthValue }}
            </th>
         </tr>
      </table>

   </div>
</template>

<script>
import {MODES, AMORTIZATIONS_TYPES} from '../constants/appConstants';
import {
   getAmortizationTable,
   getYearAmortizationData,
   getNumberAmortizationData,
} from '../utils/mortgageCalculations';
export default {
   data() {
      return {
         amortizationTable: '',
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
      mode: {
         type: String,
         required: true,
      },
   },
   watch: {
      mortgageData: {
         handler: function() {
            this.calculateAmortizationTable();
         },
         deep: true,
      },
      amortizationData: {
         handler: function() {
            this.calculateAmortizationTable();
         },
         deep: true,
      },
      mode: function() {
         this.calculateAmortizationTable();
      },
   },
   methods: {
      calculateAmortizationTable() {
         if (this.mode === MODES.SIMPLE) {
            this.amortizationTable = getAmortizationTable(
               this.mortgageData.amount, this.mortgageData.TIN, this.mortgageData.years,
            );
         } else if (this.mode === MODES.AMORTIZING) {
            if (this.amortizationData.amortizationType === AMORTIZATIONS_TYPES.ANNUAL) {
               this.amortizationTable =
                  getYearAmortizationData(
                     this.mortgageData.amount,
                     this.mortgageData.TIN,
                     this.mortgageData.years,
                     parseInt(
                        this.amortizationData.
                           amortizationAmount.
                           replaceAll('.', ''),
                     ),
                  ).amortizationTable;
            } else if (this.amortizationData.amortizationType === AMORTIZATIONS_TYPES.NUMBER) {
               this.amortizationTable =
                  getNumberAmortizationData(
                     this.mortgageData.amount,
                     this.mortgageData.TIN,
                     this.mortgageData.years,
                     parseInt(
                        this.amortizationData.
                           amortizationAmount.
                           replaceAll('.', ''),
                     ),
                     this.amortizationData.amortizationValues.frequency,
                  ).amortizationTable;
            } else if (this.amortizationData.amortizationType === AMORTIZATIONS_TYPES.CUSTOM) {
               this.amortizationTable = [];
            }
         }
      },
   },
   created() {
      this.MODES = MODES;
      this.AMORTIZATIONS_TYPES = AMORTIZATIONS_TYPES;
   },
};
</script>

<style>

.zebra-table {
  background-color: #7979792c;
}

.zebra-table th, .zebra-table td {
  border: 1px solid #ccc;
  text-align: center;
  padding-bottom: 0.7em;
  padding-top: 0.7em;
}

.zebra-table .even-row {
  background-color: #f7f7f7;
}

.zebra-table .odd-row {
  background-color: #fff;
}

</style>
