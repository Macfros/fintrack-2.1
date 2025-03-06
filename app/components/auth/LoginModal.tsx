"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { FcGoogle } from "react-icons/fc";
import EmailInput from "./EmailInput";
import { useState, useEffect } from "react";
import { handleGoogleLogin, signInWithMagicLinks } from "./AuthFunctions";

interface LoginModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  const handleFormValue = (data: string | (readonly string[] & string) | undefined) => {
    if (typeof data === "string" && data.trim() !== "") {
      setEmail(data);
    } else {
      setEmail("");
    }
  };

  const handleMagicLinkSignIn = () => {
    signInWithMagicLinks(email, setLoading, setEmailSent);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full">
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
            <ModalBody>
              <Button size="lg" className="w-full" onClick={handleGoogleLogin} color="success" variant="flat">
                Sign in using Google Account <FcGoogle size={20} />
              </Button>

              <div className="flex items-center w-full my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-600 font-semibold">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <EmailInput handleData={handleFormValue} />

              {emailSent && (
                <span className="text-green-600 text-sm">
                  Yay! Login link sent to your email
                </span>
              )}
            </ModalBody>

            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>

              <Button isDisabled={disabled} color="primary" onPress={handleMagicLinkSignIn} isLoading={loading}>
                Send Magic Link
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
