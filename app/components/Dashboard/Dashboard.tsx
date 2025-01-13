"use client";

import React, { useEffect, useState } from 'react';
import { FiHome, FiUser, FiSettings } from 'react-icons/fi';
import Sidebar, { SidebarItem } from '../Sidebar/Sidebar';
import Homepage from "@/app/components/HomePage/Homepage"
import BillOperations from '../Bills/BillOperations';
import { useAppDispatch } from '@/app/store/hooks';
import { BillModel } from '@/app/Models/Models';
import { setBills } from '@/app/store/slices/bill';


interface AppProps{
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
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
  const dispatch = useAppDispatch();

  const handleSetActivePage = (page: string) => {
    console.log(page);
    setActivePage(page);
  };

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await fetch('/api/BillActions/GetAllBills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user }), // Send the user object as JSON
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data: BillModel[] = await response.json();
        //console.log(data);
        dispatch(setBills(data));
        
      } catch (e) {
        console.error('Error fetching bills:', e);
      }
    };

    fetchBills();
    
  }, [dispatch]);

  return (
    <div className="flex w-full">
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
        {activePage === "Bills" &&  <div className="w-full">
            <BillOperations />
          </div>}
        {activePage === "Settings" && <h1>Settings Page Content</h1>}
      </main>
    </div>
  );
};

export default Dashboard;
