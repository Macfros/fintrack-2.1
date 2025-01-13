"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/button";
import { FcGoogle } from "react-icons/fc";
import { handleGoogleLogin, signInWithMagicLinks } from "../auth/AuthFunctions";
import EmailInput from "../auth/EmailInput";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);

  useEffect(() => {
    setDisabled(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.trim()));
  }, [email]);

  const handleEmailChange = (email: string) => {
    setEmail(email);
  };

  const handleMagicLinkSignIn = () => {
    signInWithMagicLinks(email, setLoading, setEmailSent);
  };

  return (
    <div className="w-full min-h-screen flex">
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="./office.png"
          height={450}
          width={450}
          alt="Office illustration"
          loading="lazy"
        />
      </div>
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <img src="./Logo.png" alt="App logo" height={100} width={100} loading="lazy" />
        <div>
            <p className="font-semibold text-gray-800">Manage your finances like a pro!</p>
        </div>
        <div>
            <p className="font-semobold text-gray-600">Deep dive into our smart App</p>
        </div>
       
        <div className="w-4/5 max-w-xs mt-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleGoogleLogin}
            color="success"
            variant="flat"
          >
            Sign in using Google Account <FcGoogle size={20} />
          </Button>

          <div className="flex items-center w-full my-4">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="mx-4 text-gray-600 font-semibold">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <EmailInput handleData={handleEmailChange} />

          {emailSent && (
            <span className="text-green-600 text-sm m-3 flex text-center justify-center">
              Yay! Login link sent to your email
            </span>
          )}

          <Button
            size="lg"
            className="w-full"
            color="primary"
            onClick={handleMagicLinkSignIn}
            disabled={disabled}
            isLoading={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
        </div>
      </div>
      <div className="min-h-screen flex items-center justify-center">
        <img
          src="./pie-chart.png"
          height={450}
          width={450}
          alt="Pie chart illustration"
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default LoginScreen;
