"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useCallback } from 'react';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import Sidebar, { SidebarItem } from '../Sidebar/Sidebar';
const Homepage = dynamic(() => import("@/app/components/HomePage/Homepage"));
const BillOperations = dynamic(() => import("../Bills/BillOperations"));

interface AppProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const sidebarItems = [
  { icon: <FiHome />, page: "Home" },
  { icon: <FiUser />, page: "Bills" },
  { icon: <FiSettings />, page: "Settings" }
];

const Dashboard: React.FC<AppProps> = ({ user }) => {
  const [activePage, setActivePage] = useState("Home");

  const handleSetActivePage = useCallback((page: string) => {
    setActivePage(page);
  }, []);

  // Bills are now fetched inside BillOperations
  useEffect(() => {}, [user]);

  return (
    <div className="flex w-full overflow-x-hidden">
      <Sidebar user={user}>
        {sidebarItems.map((item, i) => (
          <SidebarItem
            key={i}
            icon={item.icon}
            text={item.page}
            active={activePage === item.page}
            onClick={() => handleSetActivePage(item.page)}
          />
        ))}
      </Sidebar>

      <main className="flex-grow p-4 min-w-0">
        {activePage === "Home" && <Homepage user={user} />}
        {activePage === "Bills" && (
          <div className="w-full">
            <BillOperations user={user} />
          </div>
        )}
        {activePage === "Settings" && <h1>Settings Page Content</h1>}
      </main>
    </div>
  );
};

export default Dashboard;
