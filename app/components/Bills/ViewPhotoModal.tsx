// ViewPhotoModal.tsx
import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { BillModel } from "@/app/Models/Models";

interface ViewPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: BillModel;
}

const ViewPhotoModal: React.FC<ViewPhotoModalProps> = ({ isOpen, onClose, onConfirm, itemName }) => {

  console.log(itemName); 

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>{itemName?.name}</ModalHeader>
        <ModalBody>
       <div className="flex justify-center items-center w-full">
            {itemName?.secure_url ? (
              <img
                src={itemName.secure_url}
                alt="Preview"
                className="max-w-full h-auto object-contain"
              />
            ) : (
              <p className="text-center text-gray-500">Image not available</p>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="ghost" onClick={onClose}>Close</Button>
          <Button className="text-white" color="success" variant="shadow" onClick={onConfirm}>Download</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewPhotoModal;
