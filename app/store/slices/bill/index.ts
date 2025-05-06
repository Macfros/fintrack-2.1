  "use client";

  import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
  import { BillModel } from '@/app/models/Models';

  interface BillState {
    billList: BillModel[];
    summary: BillSummary | null; // Stores summary separately
  }

  interface BillSummary {
    totalAmount: number;
    currentMonthAmount: { amount: number; comparison: string };
    mostSpentCategory: { category: string; total: number };
    miscellaneousSpent: { amount: number; comparison: string };
  }

  const initialState: BillState = {
    billList: [],
    summary: null,
  };

  export const billSlice = createSlice({
    name: 'bills',
    initialState,
    reducers: {
      setBills: (state, action: PayloadAction<BillModel[]>) => {
        state.billList = action.payload;
      },
      addBill: (state, action: PayloadAction<BillModel>) => {
        state.billList = [action.payload, ...state.billList];
      },
      deleteBill: (state, action: PayloadAction<BillModel>) => {
        state.billList = state.billList.filter(bill => bill.id !== action.payload.id);
      },
      setBillSummary(state, action: PayloadAction<BillSummary>) {
        state.summary = action.payload;
      },
    },
  });

  export const { setBills, addBill, deleteBill, setBillSummary } = billSlice.actions;

  // Fixed version:
  export const selectTotalAmountSelector = (state: { bills: BillState }) => 
    state.bills.summary?.totalAmount || 0;

  const defaultCurrentMonthAmount = { amount: 0, comparison: "" };
  const defaultMostSpentCategory = { category: "", total: 0 };
  const defaultMiscellaneousSpent = { amount: 0, comparison: "" };

  export const selectCurrentMonthAmountSelector = createSelector(
    (state: { bills: BillState }) => state.bills.summary?.currentMonthAmount ?? defaultCurrentMonthAmount,
    (currentMonthAmount) => ({ ...currentMonthAmount }) // Return a shallow copy
  );

  export const mostSpentCategorySelector = createSelector(
    (state: { bills: BillState }) => state.bills.summary?.mostSpentCategory ?? defaultMostSpentCategory,
    (mostSpentCategory) => ({ ...mostSpentCategory }) // Return a shallow copy
  );

  export const MiscellaneousSpentSelector = createSelector(
    (state: { bills: BillState }) => state.bills.summary?.miscellaneousSpent ?? defaultMiscellaneousSpent,
    (miscellaneousSpent) => ({ ...miscellaneousSpent }) // Return a shallow copy
  );

// Helper function to get current and previous month information
// const getCurrentAndPreviousMonths = () => {
//   const currentMonth = new Date().getMonth(); // 0 = January, 11 = December
//   const currentYear = new Date().getFullYear();
  
//   const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // December is 11
//   const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  
//   return { currentMonth, currentYear, previousMonth, previousMonthYear };
// };

// export const selectTotalAmount = (state: { bills: BillState }) => 
//   state.bills.billList.reduce((total, bill) => total + bill.amount, 0);

// export const lastMonthAmount = createSelector((state: { bills: BillState })=>state.bills.billList, (billList) => {
//   const {previousMonth, previousMonthYear} = getCurrentAndPreviousMonths();
//   return billList
//     .filter(bill => {
//       const billDate = new Date(bill.createdAt);
//       return (
//         billDate.getMonth() === previousMonth && 
//         billDate.getFullYear() === previousMonthYear
//       );
//     })
//     .reduce((total, bill) => total + bill.amount, 0);
// });

// export const selectCurrentMonthAmount = createSelector((state: { bills: BillState }) => state.bills.billList, lastMonthAmount, (billList, _lastMonthAmount) => {
//   const currentMonthCard = { amount: 0, comparison: '' };
//   const { currentMonth, currentYear } = getCurrentAndPreviousMonths();

//   currentMonthCard.amount = billList
//     .filter(bill => {
//       const billDate = new Date(bill.createdAt);
//       return (
//         billDate.getMonth() === currentMonth && 
//         billDate.getFullYear() === currentYear
//       );
//     })
//     .reduce((total, bill) => total + bill.amount, 0);

//   if (_lastMonthAmount > 0) {
//     const percentageChange = ((currentMonthCard.amount - _lastMonthAmount) / _lastMonthAmount) * 100;
//     currentMonthCard.comparison = percentageChange > 0
//       ? `${percentageChange.toFixed(2)}% more than last month`
//       : `${(Math.abs(percentageChange).toFixed(2))}% less than last month`;
//   } else {
//     currentMonthCard.comparison = 'No data for last month';
//   }

//   return currentMonthCard;
// });

// export const mostSpentCategory = createSelector((state: { bills: BillState }) => state.bills.billList,
// (billList) => {
//   const categoryTotals: { [key: string]: number } = {};

//   billList.forEach(bill => {
//     if (categoryTotals[bill.category]) {
//       categoryTotals[bill.category] += bill.amount;
//     } else {
//       categoryTotals[bill.category] = bill.amount;
//     }
//   });

//   let mostSpent = { category: '', total: 0 };
//   for (const category in categoryTotals) {
//     if (categoryTotals[category] > mostSpent.total) {
//       mostSpent = { category, total: categoryTotals[category] };
//     }
//   }

//   return mostSpent;
// });

// export const MiscellaneousSpent = createSelector((state: { bills: BillState }) => state.bills.billList,
// (billList) => {
//   let miscellaneousCard = { amount: 0, comparison: "" };
//   let amount = 0;

//   billList.forEach(element => {
//     if (element.category === "Miscellaneous") {
//       amount += element.amount;
//     }
//   });

//   miscellaneousCard.amount = amount;

//   const { previousMonth, previousMonthYear } = getCurrentAndPreviousMonths();

//   const lastMonthMiscellaneousAmount = billList
//     .filter(bill => {
//       const billDate = new Date(bill.createdAt);
//       return (
//         billDate.getMonth() === previousMonth &&
//         billDate.getFullYear() === previousMonthYear &&
//         bill.category === "Miscellaneous"
//       );
//     })
//     .reduce((total, bill) => total + bill.amount, 0);

//   // Comparison logic can be added here if needed
//   if (lastMonthMiscellaneousAmount > 0) {
//     const percentageChange = ((amount - lastMonthMiscellaneousAmount) / lastMonthMiscellaneousAmount) * 100;
//     miscellaneousCard.comparison = percentageChange > 0
//       ? `${percentageChange.toFixed(2)}% more than last month`
//       : `${(Math.abs(percentageChange).toFixed(2))}% less than last month`;
//   } else {
//     miscellaneousCard.comparison = 'No data for last month';
//   }

//   return miscellaneousCard;
// });


export default billSlice.reducer;
