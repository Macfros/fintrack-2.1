import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/react";
import UploadBillManually from "./UploadBillManually";
import { Bot, ReceiptText } from "lucide-react";
import BillTable from "./BillTable";
import UploadBillWithAI from "./UploadBillWithAI";

const BillOperations: React.FC = () => {
    const { isOpen: isMannualOpen, onOpen: ToggleMannual, onClose: closeMannual } = useDisclosure(); // Get functions to open and close the modal
    const { isOpen: isAIOpen, onOpen: toggleAI, onClose: closeAI } = useDisclosure(); // Get functions to open and close the modal

    return (
        <>
        <div className="flex gap-4 items-center">
            <Button onClick={ToggleMannual} color="success"  className="text-white" endContent={<ReceiptText />}>Upload Bill Manually</Button> {/* Button to open the modal */}
            <UploadBillManually isOpen={isMannualOpen} onClose={closeMannual} /> {/* Pass modal state to the UploadBillManually component */}
            <Button onClick={toggleAI} color="danger"  className="text-white" endContent={<Bot />}>Upload Bill using AI</Button> {/* Button to open the modal */}
            <UploadBillWithAI isOpen={isAIOpen} onClose={closeAI}/>
        </div>
        <div>
            <BillTable />
        </div>
        </>
    );
}

export default BillOperations;
