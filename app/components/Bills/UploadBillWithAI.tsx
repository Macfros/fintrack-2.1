import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/app/store/hooks";
import { addBill } from "@/app/store/slices/bill";

const UploadBillWithAI: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
    const dispatch = useAppDispatch();
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
    const file = event.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!imageFile) {
      alert("Please upload an image before submitting.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", imageFile);

    try {
      const response = await fetch("/api/BillActions/UploadBillWithAI", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Bill Uploaded!");
        const { data } = await response.json();
        console.log("bill came:",data);
        dispatch(addBill(data));
        setImagePreview(null);
        setImageFile(null); 
        onClose();
        
      } else {
        const errorResponse = await response.json(); // Parse the error message from the response body
        toast.error(errorResponse.message || "An error occurred while uploading.");
      }
    } catch (error: any) {
        toast.error(error.message || "An unexpected error occured");
    } finally {
      setLoading(false);
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
              isDisabled={loading}
              className="w-full"
            >
              {loading ? "Uploading..." : "Submit"}
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UploadBillWithAI;
