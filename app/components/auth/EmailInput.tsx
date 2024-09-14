// EmailInput.tsx
import React from "react";
import { Input } from "@nextui-org/react";

interface EmailInputProps {
    handleData: (data: string | (readonly string[] & string) | undefined) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ handleData }) => {
    const [value, setValue] = React.useState<string | (readonly string[] & string) | undefined>("");

    const validateEmail = (value: string | (readonly string[] & string) | undefined) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value || "");

    // Effect to handle email validation and state updates
    React.useEffect(() => {
        const isInvalid = value === "" ? false : !validateEmail(value);

        handleData(value); // Call to update the parent with the current value
    }, [value, handleData]);

    return (
        <Input
            value={value}
            type="email"
            label="Email"
            variant="bordered"
            isInvalid={value !== "" && !validateEmail(value)} // Check validity for UI
            color={value !== "" && !validateEmail(value) ? "danger" : "success"}
            errorMessage="Please enter a valid email"
            onValueChange={setValue}
            className="w-full"
        />
    );
}

export default EmailInput;