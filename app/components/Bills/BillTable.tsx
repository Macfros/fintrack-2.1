import React, { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner, Button } from "@nextui-org/react";
import { TableItem } from "@/app/Models/Models";

const BillTable: React.FC = () => {
  const [bills, setBills] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await fetch('/api/BillActions/GetAllBills', {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: TableItem[] = await response.json();
      setBills(data);

    } catch (e: any) {
      console.error(e);
      setError('Error fetching bills');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Spinner />
    </div>
  );
  
  if (error) return <div>{error}</div>;

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
      <TableBody items={bills}>
        {bills.map((item: TableItem, index: number) => (
          <TableRow key={item.id}>
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
