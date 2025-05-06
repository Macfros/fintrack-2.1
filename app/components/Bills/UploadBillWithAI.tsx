import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/app/store/hooks";
import { addBill } from "@/app/store/slices/bill";
import { useAddAiBillMutation } from "@/app/store/api/bill.api"; // ← ensure correct path

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const UploadBillWithAI: React.FC<Props> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [addAiBill, { isLoading }] = useAddAiBillMutation();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      toast.error("Please upload an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const result = await addAiBill(formData).unwrap();
      toast.success("Bill uploaded!");
      dispatch(addBill(result));
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Upload Image</ModalHeader>
        <ModalBody>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-4 transition-colors duration-300 ${
              dragOver ? "bg-blue-50 border-blue-400" : "bg-gray-50 border-gray-300"
            } flex flex-col justify-center items-center min-h-[150px]`}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="max-w-full max-h-[150px] mt-2"
              />
            ) : (
              <p className="text-gray-600 text-center">
                Drag and drop an image here or click below to upload.
              </p>
            )}
          </div>
          <input
            accept="image/*"
            type="file"
            onChange={handleFileChange}
            id="fileInput"
            className="hidden"
          />
          <label htmlFor="fileInput" className="mt-4 flex justify-center">
            <Button color="primary" as="span">
              Choose File
            </Button>
          </label>
          <div className="mt-4 flex justify-end">
            <Button
              color="success"
              onPress={handleSubmit}
              isDisabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadBillWithAI;
