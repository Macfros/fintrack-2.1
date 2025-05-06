// // AuthFunctions.ts
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";

export const signInWithMagicLinks = async (
    email: string,
    setLoading: (value: boolean) => void,
    setEmailSent: (value: boolean) => void

  ) => {
    
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await signIn("email", { email, redirect: false });
      if (result?.error) throw new Error(result.error);
      setEmailSent(true);

    } catch (error) {
      console.error("Error during sign-in:", error);
      toast.error("Error during sign-in. Please try again.");

    } finally {

      setLoading(false);
    }
  };
  
export const handleGoogleLogin = async () => {
  try {
    await signIn("google");
    
  } catch (error) {
    console.error("Error during Google Sign-in:", error);
    toast.error("Error during Google Sign-in. Please try again.");
  }
};
