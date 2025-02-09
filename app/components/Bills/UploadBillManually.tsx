import { Button } from "@nextui-org/button";
import { IndianRupee, ReceiptText, Trash } from "lucide-react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Input } from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import { useState, ChangeEvent } from "react";
import { BillModel, SubItemModel } from "@/app/Models/Models";
import toast from 'react-hot-toast';
import { categories } from "@/app/Constants/constants";
import { useAppDispatch,useAppSelector } from "@/app/store/hooks";
import { addBill } from "@/app/store/slices/bill";

interface SubItemProps {
    index: number;
    subItem: SubItemModel;
    onDelete: () => void;
    onChange: (index: number, updatedSubItem: SubItemModel) => void;
}


const SubItem: React.FC<SubItemProps> = ({ index, subItem, onDelete, onChange }) => {
    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(index, { ...subItem, name: e.target.value });
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const amount = parseFloat(e.target.value) || 0;
        onChange(index, { ...subItem, amount });
    };

    return (
        <div className="flex gap-2 mb-2 items-center">
            <div style={{ width: '44px' }}>
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
            <div style={{ width: '100px' }}>
                <Input
                    type="number"
                    placeholder="0.00"
                    variant="bordered"
                    value={subItem.amount.toString()}
                    onChange={handleAmountChange}
                    startContent={
                        <div className="pointer-events-none flex items-center">
                            <IndianRupee width={15} />
                        </div>
                    }
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
        billImage: undefined         
    });

    const handleSubItemChange = (index: number, updatedSubItem: SubItemModel) => {
        const updatedSubitems = subitems.map((item, i) => i === index ? updatedSubItem : item);
        setSubitems(updatedSubitems);
        updateTotalAmount(updatedSubitems);
    };

    const handleBillChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBill(prev => ({ ...prev, [name]: value }));
    };

    const updateTotalAmount = (items: SubItemModel[]) => {
        const total = items.reduce((sum, item) => sum + item.amount, 0);
        setBill(prev => ({ ...prev, amount: total }));
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBill((prev) => ({ ...prev, billImage: e.target.files![0] })); // Set the selected file in the bill model
        }
    };

    const addSubItem = () => {
        setSubitems(prev => [...prev, { id: prev.length, name: "", amount: 0 }]);
    };

    const removeSubItem = (index: number) => {
        const updatedSubitems = subitems.filter((_, i) => i !== index);
        setSubitems(updatedSubitems);
        updateTotalAmount(updatedSubitems);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent the default form submission behavior
        
        const formData = new FormData(); //Create a new FormData object
        formData.append('name', bill.name); // Append the bill title
        formData.append('category', bill.category); // Append the bill title
        formData.append('amount', bill.amount.toString()); // Ensure amount is a string
        formData.append('date', new Date().toISOString()); // Use ISO format for date
        formData.append('subItems', JSON.stringify(subitems)); // Append subitems as a JSON string
        if (bill.billImage) {
            formData.append('billImage', bill.billImage); // Attach the image if provided
        }
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });
    

        try {
            const response = await fetch('/api/BillActions/UploadBillManually', {
                method: 'POST',
                body: formData, // Send the FormData object
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const result = await response.json(); // Parse the JSON response

            const mappedResult = {
                ...result,
                subItems: result.subitems || [], // Map 'subitems' to 'subItems'
            };

            console.log('Response:', result);
            toast.success("Bill Uploaded!");
            dispatch(addBill(mappedResult));
            
             // Log the response for debugging
        } catch (error) {

            console.error('Error submitting form:', error); // Handle errors
            toast.error("Oops! something went wrong");

        }

        setSubitems([{ id: 0, name: "", amount: 0 }]);
        setBill({
            id: "",
            name: "",
            category: "",
            amount: 0,
            createdAt: "",
            subItems: [],
            billImage: undefined
        });

        onClose();
    };

    return (
        <div>
             <Modal isOpen={isOpen} onOpenChange={onClose}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Upload Bill</ModalHeader>
                            <form onSubmit={handleSubmit}>
                            <ModalBody>
                                <p>
                                    Enter the details of your bill. You can also enter the subitems.
                                </p>
                                <Input type="text" variant="underlined" name="name" label="Bill Title" value={bill.name} onChange={handleBillChange} isRequired/>
                                <Dropdown>
                            <DropdownTrigger>
                                <Button variant="ghost" color="primary">{bill.category || "Choose category"}</Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                aria-label="Category selection"
                                onAction={(key) => setBill(prev => ({ ...prev, category: key as string }))} // Update category on selection
                            >
                                {categories.map((item) => (
                                    <DropdownItem key={item} aria-label={item}>
                                        {item}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>

                                <div className="max-h-[150px] overflow-y-scroll">
                                    {/* Render the array of SubItem components */}
                                    {subitems.map((item, index) => (
                                        <SubItem
                                        key={index}
                                        index={index}
                                        subItem={item}
                                        onDelete={() => removeSubItem(index)}
                                        onChange={handleSubItemChange}
                                     />
                                    ))}
                                </div>
                                <div className="flex">
                                    <Button variant="flat" color="success" onClick={addSubItem}>
                                        Add SubItem
                                    </Button>
                                </div>
                                <div className="flex mt-4">
                                    <Input type="text" variant="underlined" disabled placeholder={`Total Amount:}`} />
                                    <div style={{ width: '200px' }}>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            variant="bordered"
                                            disabled
                                            value={bill.amount.toFixed(2)}
                                            startContent={
                                                <div className="pointer-events-none flex items-center">
                                                    <IndianRupee width={15} />
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                            <Input  type="file" accept="image/*" onChange={handleImageChange} /> {/* New file input */}
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="primary" type="submit"> {/* Change to type="submit" */}
                                    Upload!
                                </Button>
                            </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default UploadBillManually;





