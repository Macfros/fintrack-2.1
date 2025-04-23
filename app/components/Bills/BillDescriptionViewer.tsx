"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  Button,
  ModalBody,
} from "@heroui/react";
import { BillModel, SubItemModel } from "@/app/Models/Models";

interface BillDescriptionViewerProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: BillModel | null;
}

// Render sub-items using a vanilla HTML table
const renderSubItems = (subItems: SubItemModel[] | undefined) => {
  if (!subItems || subItems.length === 0) {
    return (
      <tr>
        <td>No Subitems</td>
      </tr>
    );
  }

  return (
    <>
      {subItems.map((subItem: SubItemModel, index: number) => (
        <tr key={index} className="even:bg-gray-200"> 
          <td className="p-3">{subItem.name || "N/A"}</td>
          <td className="p-3">{subItem.amount || 0}</td> 
        </tr>
      ))}
    </>
  );
};

const BillDescriptionViewer: React.FC<BillDescriptionViewerProps> = ({
  isOpen,
  onClose,
  itemName,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody>
          {/* Safeguard itemName and handle cases where it might be undefined or null */}
          {itemName ? (
            itemName.subItems && itemName.subItems.length > 0 ? (
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-3">{itemName.name || "N/A"}</th>
                  </tr>
                </thead>

                <tbody>
                  {renderSubItems(itemName.subItems)}
                  <tr className="font-bold">
                    <td className="p-3">Total</td>
                    <td className="p-3">{itemName.amount || 0}</td> {/* Safeguard amount */}
                  </tr>
                </tbody>
              </table>
            ) : (
              <ModalHeader>No Subitems found!</ModalHeader>
            )
          ) : (
            <ModalHeader>No item selected!</ModalHeader>
          )}
        </ModalBody>
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
