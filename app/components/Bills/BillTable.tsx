import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@nextui-org/react";
import { BillModel } from "@/app/Models/Models";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deleteBill } from "@/app/store/slices/bill";
import { List, Trash } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BillDescriptionViewer from "./BillDescriptionViewer";

const BillTable: React.FC = () => {
  const billList = useAppSelector((state) => state.bills.billList);
  const dispatch = useAppDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillModel | null>(null);

  const handleDeleteClick = (item: BillModel) => {
    setSelectedBill(item);  
    setIsDeleteModalOpen(true);   
  };

  const handleViewer = (item: BillModel) => {
    setSelectedBill(item);
    setIsViewModalOpen(true);
  }

  const confirmDelete = async () => {
    if (selectedBill) {
      try {
        const response = await fetch('/api/BillActions/DeleteBill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: selectedBill.id }),  // Send only the bill ID
        });

        if (!response.ok) {
          toast.error("Something went wrong!");
          return;
        }

        dispatch(deleteBill(selectedBill));  // Dispatch the deletion action
        toast.success("Bill Deleted!");

      } catch (e) {
        toast.error("Something went wrong!");
      } finally {
        setIsDeleteModalOpen(false);  // Close the modal after the action
      }
    }
  };

  return (
    <>
      <Table
        isHeaderSticky
        aria-label="Example table with client side sorting"
        classNames={{
          base: "max-h-[520px] overflow-scroll",
          table: "min-h-[420px]",
        }}
      >
        <TableHeader className="">
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
              <TableCell className="flex gap-2">
                <Button
                onClick={()=> handleViewer(item)}
                isIconOnly
                color="success"
                variant="ghost"
                aria-label="View Bill"
                >
                  <List />
                  </Button>
                <Button
                  onClick={() => handleDeleteClick(item)}
                  isIconOnly
                  color="danger"
                  variant="ghost"
                  aria-label="Delete Bill"
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <BillDescriptionViewer
          isOpen={isViewModalOpen}
          onClose={()=> setIsViewModalOpen(false)}
          itemName = {selectedBill}
          totalAmount={selectedBill?.amount || 0}
          />
      {/* Reusable Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedBill?.name || "this bill"}
      />
    </>
  );
};

export default BillTable;
