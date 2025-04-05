import { Button } from "@heroui/button";
import { IndianRupee, Trash } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useState, ChangeEvent, useCallback } from "react";
import { BillModel, SubItemModel } from "@/app/Models/Models";
import toast from "react-hot-toast";
import { categories } from "@/app/Constants/constants";
import { useAppDispatch } from "@/app/store/hooks";
import { addBill } from "@/app/store/slices/bill";

interface SubItemProps {
  index: number;
  subItem: SubItemModel;
  onDelete: () => void;
  onChange: (index: number, updatedSubItem: SubItemModel) => void;
}

const SubItem: React.FC<SubItemProps> = ({ index, subItem, onDelete, onChange }) => {
  const handleNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => onChange(index, { ...subItem, name: e.target.value }),
    [index, subItem, onChange]
  );

  const handleAmountChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const amount = parseFloat(e.target.value) || 0;
      onChange(index, { ...subItem, amount });
    },
    [index, subItem, onChange]
  );

  return (
    <div className="flex gap-2 mb-2 items-center">
      <div style={{ width: "44px" }}>
        <Input type="text" placeholder={(index + 1).toString()} variant="bordered" disabled />
      </div>
      <div style={{ flex: 1 }}>
        <Input
          type="text"
          variant="bordered"
          placeholder="SubItem Name"
          value={subItem.name}
          onChange={handleNameChange}
        />
      </div>
      <div style={{ width: "100px" }}>
        <Input
          type="number"
          placeholder="0.00"
          variant="bordered"
          value={subItem.amount.toString()}
          onChange={handleAmountChange}
          startContent={<div className="pointer-events-none flex items-center"><IndianRupee width={15} /></div>}
        />
      </div>
      <Button isIconOnly color="danger" onPress={onDelete}><Trash /></Button>
    </div>
  );
};

const UploadBillManually: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [subitems, setSubitems] = useState<SubItemModel[]>([{ id: 0, name: "", amount: 0 }]);
  const [bill, setBill] = useState<BillModel>({
    id: "",
    name: "",
    category: "",
    amount: 0,
    createdAt: "",
    subItems: [],
    billImage: undefined,
  });

  const handleSubItemChange = useCallback(
    (index: number, updatedSubItem: SubItemModel) => {
      setSubitems((prev) => {
        const updatedSubitems = prev.map((item, i) => (i === index ? updatedSubItem : item));
        const total = updatedSubitems.reduce((sum, item) => sum + item.amount, 0);
        setBill((prevBill) => ({ ...prevBill, amount: total }));
        return updatedSubitems;
      });
    },
    []
  );

  const handleBillChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setBill((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleImageChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setBill((prev) => ({ ...prev, billImage: e.target.files![0] }));
      }
    },
    []
  );

  const addSubItem = useCallback(() => {
    setSubitems((prev) => [...prev, { id: prev.length, name: "", amount: 0 }]);
  }, []);

  const removeSubItem = useCallback(
    (index: number) => {
      setSubitems((prev) => {
        const updatedSubitems = prev.filter((_, i) => i !== index);
        const total = updatedSubitems.reduce((sum, item) => sum + item.amount, 0);
        setBill((prevBill) => ({ ...prevBill, amount: total }));
        return updatedSubitems;
      });
    },
    []
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", bill.name);
    formData.append("category", bill.category);
    formData.append("amount", bill.amount.toString());
    formData.append("date", new Date().toISOString());
    formData.append("subItems", JSON.stringify(subitems));
    if (bill.billImage) formData.append("billImage", bill.billImage);

    try {
      const response = await fetch("/api/BillActions/UploadBillManually", { method: "POST", body: formData });
      if (!response.ok) throw new Error("Network response was not ok");
      const { data } = await response.json();
      const mappedResult = { ...data, subItems: data.subitems || [] };
      toast.success("Bill Uploaded!");
      dispatch(addBill(mappedResult));
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Oops! Something went wrong");
    }

    setSubitems([{ id: 0, name: "", amount: 0 }]);
    setBill({ id: "", name: "", category: "", amount: 0, createdAt: "", subItems: [], billImage: undefined });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">Upload Bill</ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <p>Enter the details of your bill. You can also enter the subitems.</p>
                <Input
                  type="text"
                  variant="underlined"
                  name="name"
                  label="Bill Title"
                  value={bill.name}
                  onChange={handleBillChange}
                  isRequired
                />
                <select
                        value={bill.category}
                        onChange={(e) => setBill((prev) => ({ ...prev, category: e.target.value }))}
                        className="border border-gray-300 rounded p-2 w-full"
                        >
                        <option value="">Choose category</option>
                        {categories.map((item) => (
                            <option key={item} value={item}>
                            {item}
                            </option>
                        ))}
                        </select>

                <div className="max-h-[150px] overflow-y-scroll">
                  {subitems.map((item, index) => (
                    <SubItem
                      key={item.id}
                      index={index}
                      subItem={item}
                      onDelete={() => removeSubItem(index)}
                      onChange={handleSubItemChange}
                    />
                  ))}
                </div>
                <div className="flex">
                  <Button variant="flat" color="success" onPress={addSubItem}>
                    Add SubItem
                  </Button>
                </div>
                <div className="flex mt-4">
                  <Input type="text" variant="underlined" disabled placeholder="Total Amount:" />
                  <div style={{ width: "200px" }}>
                    <Input
                      type="number"
                      placeholder="0.00"
                      variant="bordered"
                      disabled
                      value={bill.amount.toFixed(2)}
                      startContent={<div className="pointer-events-none flex items-center"><IndianRupee width={15} /></div>}
                    />
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Upload!
                </Button>
              </ModalFooter>
            </form>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UploadBillManually;