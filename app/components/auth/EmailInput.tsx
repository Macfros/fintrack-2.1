"use client";
import React from "react";
import { Input } from "@nextui-org/react";

interface EmailInputProps {
  handleData: (data: string) => void;
}

const EmailInput: React.FC<EmailInputProps> = ({ handleData }) => {
  const [value, setValue] = React.useState<string>("");

  const validateEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  React.useEffect(() => {
    handleData(value); // Always pass a string
  }, [value, handleData]);

  return (
    <Input
      value={value}
      type="email"
      label="Email"
      variant="bordered"
      isInvalid={value !== "" && !validateEmail(value)}
      color={value !== "" && !validateEmail(value) ? "danger" : "success"}
      errorMessage="Please enter a valid email"
      onChange={(e) => setValue(e.target.value)}
      className="w-full"
    />
  );
};

export default EmailInput;
