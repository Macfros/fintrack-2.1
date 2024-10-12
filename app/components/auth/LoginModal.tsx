'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";
import EmailInput from "./EmailInput";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";  // Import signIn from next-auth

interface LoginModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [disabled, setDisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const handleFormValue = (data: string | (readonly string[] & string) | undefined) => {
    if (typeof data === "string" && data.trim() !== "") {
      setEmail(data);
    } else {
      setEmail("");
    }
  };

  useEffect(() => {
    setDisabled(email.trim() === "");
  }, [email]);

  const SignInWithMagicLinks = async () => {
    if (email === "") {
      alert("Please enter email");
      return;
    }
  
    setDisabled(true);
    setLoading(true);
  
    try {
      const result = await signIn("email", {
        email,
        redirect: false // This prevents the page from redirecting automatically
      });
  
      if (result?.error) {
        throw new Error(result.error);
      } else {
        setLoading(false);
        setEmailSent(true); // Show success message
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setDisabled(false);
      setLoading(false);
    }
  };
  

  const handleGoogleLogin = async () => {
    try {
      // Call signIn to trigger Google sign-in
      await signIn('google');
    } catch (error) {
      console.error("Error during Google Sign-in:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full">
      <ModalContent>
        {(onClose) => (
          <div>
            <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
            <ModalBody>
              <div>
                <Button size="lg" className="w-full" onClick={handleGoogleLogin} color="success" variant="flat">
                  Sign in using Google Account <FcGoogle size={20} />
                </Button>
              </div>

              <div className="flex items-center w-full my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-600 font-semibold">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <div>
                <EmailInput handleData={handleFormValue} />
              </div>
              <div>
                {emailSent && <span className="text-green-600 text-sm">Yay! Login link is sent to your mail</span>}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>

              <Button isDisabled={disabled} color="primary" onPress={SignInWithMagicLinks} isLoading={loading}>
                Send Link
              </Button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
