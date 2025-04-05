"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
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
      <div className="w-full min-h-screen flex flex-row">
        {/* Left Image  */}
        <div className="hidden md:flex w-1/3 items-center justify-center p-4">
          <img
            src="./office.png"
            className="w-full max-w-[250px] h-auto object-contain"
            alt="Office illustration"
            loading="lazy"
          />
        </div>

        {/* Center Content */}
        <div className="w-full md:w-1/3 flex flex-col items-center justify-center px-4 py-8">
          <img src="./Logo.png" alt="App logo" className="w-24 h-24 mb-4" loading="lazy" />
          
          <p className="font-semibold text-gray-800 text-center">Manage your finances like a pro!</p>
          <p className="font-semibold text-gray-600 text-center mb-6">Deep dive into our smart App</p>

          <div className="w-full max-w-md">
            <Button
              size="md"
              className="w-full flex items-center justify-center gap-2"
              onPress={handleGoogleLogin}
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

            <div className="flex flex-col gap-2">
              <EmailInput handleData={handleEmailChange} />
              {emailSent && (
                <span className="text-green-600 text-sm flex justify-center text-center">
                  Yay! Login link sent to your email
                </span>
              )}

              <Button
                size="md"
                className="w-full"
                color="primary"
                onPress={handleMagicLinkSignIn}
                disabled={disabled}
                isLoading={loading}
              >
                {loading ? "Sending..." : "Send Magic Link"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:flex w-1/3 items-center justify-center p-4">
          <img
            src="./pie-chart.png"
            className="w-full max-w-[250px] h-auto object-contain"
            alt="Pie chart illustration"
            loading="lazy"
          />
        </div>
      </div>

  );
};

export default LoginScreen;
