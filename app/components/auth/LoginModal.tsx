// LoginModal.tsx
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { GoogleButton } from "./GoogleButton";
import { FcGoogle } from "react-icons/fc";
import EmailInput from "./EmailInput";
import { useState, useEffect } from "react";
import { handleSignIn } from "./handleSignIn";

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

    // Effect to determine if the button should be disabled
    useEffect(() => {
        setDisabled(email.trim() === "");
    }, [email]);

    const SignInWithMagicLinks = async () => {
        if (email === "") {
            alert("Please enter email");
            return;
        }

        setDisabled(true); // Disable the button immediately after click
        setLoading(true);
        try {
            await handleSignIn({ email });
            setLoading(false);
            setEmailSent(true);
        } catch (error) {
            console.error("Error during sign-in:", error);
            setDisabled(false); // Re-enable button if an error occurs
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
                                <Button size="lg" className="w-full" onClick={() => GoogleButton()} color="success" variant="flat">
                                    Sign in using Google Account<FcGoogle size={20} />
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
}

export default LoginModal;