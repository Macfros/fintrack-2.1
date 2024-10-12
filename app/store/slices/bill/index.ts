"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillModel } from '@/app/Models/Models';

interface BillState {
  billList: BillModel[];
}

const initialState: BillState = {
  billList: [],
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
  },
});

export const { setBills, addBill, deleteBill } = billSlice.actions;

// Helper function to get current and previous month information
const getCurrentAndPreviousMonths = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // 0 = January, 11 = December
  const currentYear = currentDate.getFullYear();
  
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1; // December is 11
  const previousMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  return { currentMonth, currentYear, previousMonth, previousMonthYear };
};

export const selectTotalAmount = (state: { bills: BillState }) => 
  state.bills.billList.reduce((total, bill) => total + bill.amount, 0);

export const selectCurrentMonthAmount = (state: { bills: BillState }) => {
  const currentMonthCard = { amount: 0, comparison: '' };
  const { currentMonth, currentYear, previousMonth, previousMonthYear } = getCurrentAndPreviousMonths();

  const _lastMonthAmount = lastMonthAmount(state, previousMonth, previousMonthYear);

  currentMonthCard.amount = state.bills.billList
    .filter(bill => {
      const billDate = new Date(bill.createdAt);
      return (
        billDate.getMonth() === currentMonth && 
        billDate.getFullYear() === currentYear
      );
    })
    .reduce((total, bill) => total + bill.amount, 0);

  if (_lastMonthAmount > 0) {
    const percentageChange = ((currentMonthCard.amount - _lastMonthAmount) / _lastMonthAmount) * 100;
    currentMonthCard.comparison = percentageChange > 0
      ? `${percentageChange.toFixed(2)}% more than last month`
      : `${(Math.abs(percentageChange).toFixed(2))}% less than last month`;
  } else {
    currentMonthCard.comparison = 'No data for last month';
  }

  return currentMonthCard;
};

export const lastMonthAmount = (state: { bills: BillState }, previousMonth: number, previousMonthYear: number) => {
  return state.bills.billList
    .filter(bill => {
      const billDate = new Date(bill.createdAt);
      return (
        billDate.getMonth() === previousMonth && 
        billDate.getFullYear() === previousMonthYear
      );
    })
    .reduce((total, bill) => total + bill.amount, 0);
};

export const mostSpentCategory = (state: { bills: BillState }) => {
  const categoryTotals: { [key: string]: number } = {};

  state.bills.billList.forEach(bill => {
    if (categoryTotals[bill.category]) {
      categoryTotals[bill.category] += bill.amount;
    } else {
      categoryTotals[bill.category] = bill.amount;
    }
  });

  let mostSpent = { category: '', total: 0 };
  for (const category in categoryTotals) {
    if (categoryTotals[category] > mostSpent.total) {
      mostSpent = { category, total: categoryTotals[category] };
    }
  }

  return mostSpent;
};

export const MiscellaneousSpent = (state: { bills: BillState }) => {
  let miscellaneousCard = { amount: 0, comparison: "" };
  let amount = 0;

  state.bills.billList.forEach(element => {
    if (element.category === "Miscellaneous") {
      amount += element.amount;
    }
  });

  miscellaneousCard.amount = amount;

  const { currentMonth, currentYear, previousMonth, previousMonthYear } = getCurrentAndPreviousMonths();

  const lastMonthMiscellaneousAmount = state.bills.billList
    .filter(bill => {
      const billDate = new Date(bill.createdAt);
      return (
        billDate.getMonth() === previousMonth &&
        billDate.getFullYear() === previousMonthYear &&
        bill.category === "Miscellaneous"
      );
    })
    .reduce((total, bill) => total + bill.amount, 0);

  // Comparison logic can be added here if needed
  if (lastMonthMiscellaneousAmount > 0) {
    const percentageChange = ((amount - lastMonthMiscellaneousAmount) / lastMonthMiscellaneousAmount) * 100;
    miscellaneousCard.comparison = percentageChange > 0
      ? `${percentageChange.toFixed(2)}% more than last month`
      : `${(Math.abs(percentageChange).toFixed(2))}% less than last month`;
  } else {
    miscellaneousCard.comparison = 'No data for last month';
  }

  return miscellaneousCard;
};


export default billSlice.reducer;
