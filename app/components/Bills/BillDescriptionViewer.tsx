"use client"

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow
} from "@nextui-org/react";
import { BillModel, SubItemModel } from "@/app/Models/Models";

interface BillDescriptionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: BillModel | null; 
  totalAmount: number;
}

const BillDescriptionViewer: React.FC<BillDescriptionViewerProps> = ({
  isOpen,
  onClose,
  itemName,
  totalAmount
}) => {
  
  const renderSubItems = (subItems: SubItemModel[]) => {
    //console.log("subItems:", subItems);

    return (
      <>
        {subItems && subItems?.length > 0 ? (
          subItems?.map((subItem: SubItemModel, index: number) => (
            <TableRow key={index}>
              <TableCell>{subItem?.name}</TableCell>
              <TableCell>{subItem?.amount}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>No Subitem</TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {itemName && itemName?.subItems && itemName?.subItems?.length > 0 ? (
          <Table isStriped aria-label="Bill Description Table">
            <TableHeader>
              <TableRow>
                <TableCell>{itemName?.name}</TableCell>          
              </TableRow>
            </TableHeader>

            <TableBody>
              {renderSubItems(itemName?.subItems)}
              <TableRow className="font-bold">
                <TableCell>Total</TableCell>
                <TableCell>{totalAmount}</TableCell>
              </TableRow>
            </TableBody>

          </Table>
        ) : (
          <ModalHeader>No item selected!</ModalHeader>
        )}
        
        <ModalFooter>
          <Button color="danger" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>

      </ModalContent>
    </Modal>
  );
};

export default BillDescriptionViewer;
