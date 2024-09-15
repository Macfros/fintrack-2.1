"use client";

import React, { useEffect } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { BillModel } from "@/app/Models/Models";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setBills } from "@/app/store/slices/bill";

const BillTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const billList = useAppSelector((state) => state.bills.billList);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/BillActions/GetAllBills', {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: BillModel[] = await response.json();
        console.log(data);
        dispatch(setBills(data));
      } catch (e) {
        console.error('Error fetching bills:', e);
      }
    };

    fetchBills();
    
  }, [dispatch]);

  return (
    <Table
      isHeaderSticky
      aria-label="Example table with client side sorting"
      classNames={{
        base: "max-h-[520px] overflow-scroll",
        table: "min-h-[420px]",
      }}
    >
      <TableHeader>
        <TableColumn key="sno" className="bg-black text-white">S.no</TableColumn>
        <TableColumn key="name" className="bg-black text-white">Name</TableColumn>
        <TableColumn key="category" className="bg-black text-white">Category</TableColumn>
        <TableColumn key="amount" className="bg-black text-white">Amount</TableColumn>
        <TableColumn key="createdAt" className="bg-black text-white">Date</TableColumn>
        <TableColumn key="actions" className="bg-black text-white">Actions</TableColumn>
      </TableHeader>
      <TableBody items={billList}>
        {billList.map((item: BillModel, index: number) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{item.name}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.amount}</TableCell>
            <TableCell>{new Date(item.createdAt).toLocaleDateString('en-GB')}</TableCell>
            <TableCell> ... </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BillTable;
