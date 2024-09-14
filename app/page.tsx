import {Button} from "@nextui-org/button";
import getUser from "./api/auth/[...nextauth]/Hooks/getUser"
import NavbarMain from "./components/Navbar/NavbarMain";
import Dashboard from "./components/Dashboard/Dashboard";
import { Toaster } from "react-hot-toast";


export default async function Home() {
    const user = await getUser();
  
  console.log("user:"+user?.email);
  return (
    <div>
      <Toaster />
    <NavbarMain user={user}/>
      {user ? (<Dashboard user={user} />) : (<h1>No User</h1>)}
    </div>
  )
}
