"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BillModel } from '@/app/Models/Models';

interface BillState {
  billList: BillModel[]; // Updated state name
}

const initialState: BillState = {
  billList: [], // Initial empty array
};

export const billSlice = createSlice({
  name: 'bills', // Slice name
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<BillModel[]>) => {
      state.billList = action.payload; // Update state with payload
    },
    addBill: (state, action: PayloadAction<BillModel>) => {
      state.billList = [...state.billList, action.payload]; // Add new bill
    },
  },
});

export const { setBills, addBill } = billSlice.actions;
export default billSlice.reducer; // Export the reducer
