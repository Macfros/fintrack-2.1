"use client";

import React, { useState } from 'react';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import Sidebar, { SidebarItem } from '../Sidebar/Sidebar';
import { User } from 'next-auth';
import Homepage from "@/app/components/HomePage/Homepage"
import Bills from '../Bills/Bills';

interface AppProps{
  user: User
}

const sidebarItems = [
  {
    icon: <FiHome />,
    page: "Home",
  },
  {
    icon: <FiUser />,
    page: "Bills",
  },
  {
    icon: <FiSettings />,
    page: "Settings",
  }
];

const Dashboard: React.FC<AppProps> = ({user}) => {
  const [activePage, setActivePage] = useState<string>("Home");

  const handleSetActivePage = (page: string) => {
    console.log(page);
    setActivePage(page);
  };

  return (
    <div className="flex">
      <Sidebar>

        {sidebarItems.map((item,index) => (
          <SidebarItem
              key={index}
              icon={item.icon}
              text={item.page}
              active={activePage === `${item.page}`}
              onClick={() => handleSetActivePage(`${item.page}`)}
          />

        ))}
        
      </Sidebar>
      <main className="flex-grow p-4">
        {activePage === "Home" && <Homepage user={user} />}
        {activePage === "Bills" && <h1><Bills /></h1>}
        {activePage === "Settings" && <h1>Settings Page Content</h1>}
      </main>
    </div>
  );
};

export default Dashboard;
