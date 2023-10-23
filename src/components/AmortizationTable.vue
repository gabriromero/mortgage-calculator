<template>
   <div>
      <!-- To repeat -->
      <table class="zebra-table">
         <tr>
            <th style="width: 10%;">
               <b>Month number</b>
            </th>
            <th style="width: 15%;">
               <b>Interests</b>
            </th>
            <th style="width: 15%;">
               <b>Amortization</b>
            </th>
            <th style="width: 20%;">
               <b>Total payment</b>
            </th>
            <th style="width: 10%;">
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
import {
   getAmortizationTable,
   getAmortizationTableYearAmmortization,
} from '../utils/mortgageCalculations';
export default {
   data() {
      return {
         amortizationTable: '',
      };
   },
   props: {
      mortgageValues: {
         type: Object,
         required: true,
      },
      amortizationData: {
         type: Object,
         required: true,
      },
      isAdvanced: {
         type: Boolean,
         required: true,
      },
   },
   watch: {
      mortgageValues: {
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
      isAdvanced: function() {
         this.calculateAmortizationTable();
      },
   },
   methods: {
      calculateAmortizationTable() {
         if (!this.isAdvanced) {
            this.amortizationTable = getAmortizationTable(
               this.mortgageValues.amount, this.mortgageValues.TAE, this.mortgageValues.years,
            );
         } else {
            if (this.amortizationData.amortizationType === 'Annual') {
               this.amortizationTable =
                  getAmortizationTableYearAmmortization(
                     this.mortgageValues.amount,
                     this.mortgageValues.TAE,
                     this.mortgageValues.years,
                     parseInt(this.amortizationData.amortizationValue.replaceAll('.', '')),
                  );
            }
         }
      },
   },
};
</script>

<style>

.zebra-table {
  border-collapse: collapse;
  width: 100%;
  background-color: #7979792c;
}

.zebra-table th, .zebra-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}


.zebra-table .even-row {
  background-color: #f7f7f7;
}

.zebra-table .odd-row {
  background-color: #fff;
}


</style>
