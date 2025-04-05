
import { getServerSession } from "next-auth/next";
import NavbarMain from "./components/Navbar/NavbarMain";
import Dashboard from "./components/Dashboard/Dashboard";
import { authOptions } from "@/auth";
import LoginScreen from "./components/LoginScreen/LoginScreen";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const user = session?.user; 
  console.log("user:", user?.email); 

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarMain user={user} />
      <div className="flex-1 flex">
        {user ? <Dashboard user={user} /> : <LoginScreen />}
      </div>
    </div>
  );
}
