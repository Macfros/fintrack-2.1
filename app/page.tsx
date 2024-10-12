
import { getServerSession } from "next-auth/next";
import NavbarMain from "./components/Navbar/NavbarMain";
import Dashboard from "./components/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";
import { authOptions } from "@/auth";

export default async function Home() {
  // Get session data on the server-side
  const session = await getServerSession(authOptions);
  const user = session?.user; // Access the user from the session

  console.log("user:", user?.email); // This logs the user to the server-side console

  return (
    <div>
      <NavbarMain user={user} />
      {user ? <Dashboard user={user} /> : <h1>No User</h1>}
    </div>
  );
}
