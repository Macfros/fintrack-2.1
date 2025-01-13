"use client";

import React from "react";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button, useDisclosure} from "@nextui-org/react";
import { User } from "next-auth";
import LoginModal from "../auth/LoginModal";
import AvatarComponent from "../auth/AvatarComponent";
import Image from 'next/image'
import { IoMdLogIn } from "react-icons/io";


interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null; // Or directly use `User | null` if you're using next-auth User type
}

const NavbarMain: React.FC<NavbarProps> = ({user = null}) =>{
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  // /console.log("image url: "+user?.image);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
        <Image
            src="/logo.png"
            width={50}
            height={50}
            alt="Picture of the author"
          />
          <p className="font-bold text-inherit">FINTRACK</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Track
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#" aria-current="page">
            Plan
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Save
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          { user ? (<AvatarComponent img={user.image} name={user.name}/>) : (<><Button variant="flat" color="success" onPress={onOpen} endContent={<IoMdLogIn size={15} />}>Login</Button>
        <LoginModal onClose={onClose} isOpen={isOpen} /></>)}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={
                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
              }
              className="w-full"
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

export default NavbarMain;


