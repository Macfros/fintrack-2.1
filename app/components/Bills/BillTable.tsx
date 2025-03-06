import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button } from "@heroui/react";
import { BillModel } from "@/app/Models/Models";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { deleteBill } from "@/app/store/slices/bill";
import { Download, Eye, List, Trash } from "lucide-react";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import BillDescriptionViewer from "./BillDescriptionViewer";
import ViewPhotoModal from "./ViewPhotoModal";

const BillTable: React.FC = () => {
  const billList = useAppSelector((state) => state.bills.billList);
  const dispatch = useAppDispatch();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isImageIvewModalOpen, setImageViewModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<BillModel | null>(null);

  const handleDeleteClick = (item: BillModel) => {
    setSelectedBill(item);  
    setIsDeleteModalOpen(true);   
  };

  const handleViewer = (item: BillModel) => {
    setSelectedBill(item);
    setIsViewModalOpen(true);
  }

  const handleImageViewer = (bill: BillModel) => {
    setSelectedBill(bill);
    setImageViewModalOpen(true);
  }

  const DownloadButton = async (bill: BillModel | null) => {
    if (bill == null) return;

    const secureUrl = bill.secure_url; // Assuming `secureurl` is the property containing the image URL
    if (!secureUrl) return;
  
    try {
      // Fetch the image as a Blob
      const response = await fetch(secureUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
  
      const blob = await response.blob();
  
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'image.jpg'; // You can customize the filename here
  
      // Trigger the download
      document.body.appendChild(link);
      link.click();
  
      // Clean up the link element and revoke the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error('Error downloading the image:', error);
    }
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
        isStriped
        classNames={{
          base: "max-h-[500px] overflow-scroll mt-5",
          table: "min-h-[400px]",
          wrapper: "p-0"
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
        <TableBody items={billList || []}>
          {billList.map((item: BillModel, index: number) => (
            <TableRow key={index} className="align-middle">
              <TableCell className="align-middle">{index + 1}</TableCell>
              <TableCell className="align-middle">{item.name || " "}</TableCell>
              <TableCell className="align-middle">{item.category || "Miscellaneous"}</TableCell>
              <TableCell className="align-middle">{item.amount || "0.00"}</TableCell>
              <TableCell className="align-middle">{new Date(item.createdAt).toLocaleDateString('en-GB')}</TableCell>
              <TableCell className="align-middle">
                <div className="flex gap-2">
                <Button
                  onClick={() => handleViewer(item)}
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
                <Button
                  onClick={() => handleImageViewer(item)}
                  isIconOnly
                  color="success"
                  variant="ghost"
                  aria-label="View Bill"
                >
                  <Eye />
                </Button>
                </div>
              </TableCell>
            </TableRow>          
          ))}
        </TableBody>
      </Table>
      
      <BillDescriptionViewer
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          itemName={selectedBill}
        />

      {/* Reusable Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedBill?.name || "this bill"}
      />

      <ViewPhotoModal
         isOpen={isImageIvewModalOpen}
         onClose={() => setImageViewModalOpen(false)}
         onConfirm={()=> DownloadButton(selectedBill)}
         itemName={selectedBill!}
      />

    </>
  );
};

export default BillTable;
