"use client";

import React, { useEffect } from 'react';
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import { Bot, ReceiptText } from "lucide-react";
import BillTable from "./BillTable";

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { BillModel } from '@/app/models/Models';
import { setBills } from '@/app/store/slices/bill';
import { useGetBillsQuery } from '@/app/store/api/bill.api';
import UploadBillManually from './UploadBillManually';
import UploadBillWithAI from './UploadBillWithAI';

interface BillOperationsProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const BillOperations: React.FC<BillOperationsProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  // <-- fix here: slice is named 'bills' and field is 'billList'
  const bills = useAppSelector(state => state.bills.billList);
  const { data: fetchedBills = [], isLoading, isError } = useGetBillsQuery();

  useEffect(() => {
    if (fetchedBills.length > 0) {
      dispatch(setBills(fetchedBills));
    }
  }, [fetchedBills, dispatch]);

  const {
    isOpen: isManualOpen,
    onOpen: toggleManual,
    onClose: closeManual
  } = useDisclosure();

  const {
    isOpen: isAIOpen,
    onOpen: toggleAI,
    onClose: closeAI
  } = useDisclosure();

  return (
    <>
      <div className="flex gap-4 items-center">
        <Button onPress={toggleManual} color="success" className="text-white" endContent={<ReceiptText />}>
          Upload Bill Manually
        </Button>
        <UploadBillManually isOpen={isManualOpen} onClose={closeManual} />

        <Button onPress={toggleAI} color="danger" className="text-white" endContent={<Bot />}>
          Upload Bill using AI
        </Button>
        <UploadBillWithAI isOpen={isAIOpen} onClose={closeAI} />
      </div>

      <div className="mt-4">
        <BillTable />
      </div>
    </>
  );
};

export default BillOperations;
