import { signOut } from "next-auth/react";
import { PiSignOut } from "react-icons/pi";

const SignOutButtonProps = () => {
  return (
    <p className="flex gap-1 flex-row items-center" onClick={() => signOut()}>
      Sign Out <PiSignOut size={15} />
    </p>
  );
};

export default SignOutButtonProps;
