"use client";

import React, { useEffect } from 'react';
import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import UploadBillManually from "./UploadBillManually";
import UploadBillWithAI from "./UploadBillWithAI";
import { Bot, ReceiptText } from "lucide-react";
import BillTable from "./BillTable";

import { useAppDispatch, useAppSelector } from '@/app/store/hooks';
import { BillModel } from '@/app/Models/Models';
import { setBills } from '@/app/store/slices/bill';

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

  useEffect(() => {
    if (bills.length > 0) return;

    const fetchBills = async () => {
      try {
        const res = await fetch('/api/BillActions/FetchBills/GetAllBills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user }),
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const { data } = await res.json();
        dispatch(setBills(data as BillModel[]));
        console.log("Fetched bills on first load");
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };

    fetchBills();
  }, [dispatch, user, bills.length]);

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
