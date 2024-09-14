import { Button } from "@nextui-org/button";
import { useDisclosure } from "@nextui-org/react";
import UploadBillManually from "./UploadBillManually";
import { ReceiptText } from "lucide-react";
import BillTable from "./BillTable";

const Bills: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure(); // Get functions to open and close the modal

    return (
        <>
        <div className="flex gap-4 items-center">
            <Button onClick={onOpen} color="success"  className="text-white" endContent={<ReceiptText />}>Upload Bill Manually</Button> {/* Button to open the modal */}
            <UploadBillManually isOpen={isOpen} onClose={onClose} /> {/* Pass modal state to the UploadBillManually component */}
        </div>
        <div>
            <BillTable />
        </div>
        </>
    );
}

export default Bills;
