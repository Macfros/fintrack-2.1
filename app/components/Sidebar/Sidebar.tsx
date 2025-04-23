"use client";

import React, { useContext, createContext, useState, ReactNode } from 'react';
import { FiMoreVertical, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarProps {
  children: ReactNode;
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
}

const Sidebar: React.FC<SidebarProps> = ({ children, user }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-full z-10">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-3 pb-2 flex justify-between items-center">
          <img
            src="./logo.png"
            className={`overflow-hidden transition-all ${expanded ? 'w-10' : 'w-0'}`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <FiChevronLeft size={18} /> : <FiChevronRight size={18} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-2">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-2 items-center">
          <img
            src={`${user?.image}`}
            alt="User Avatar"
            className="w-8 h-8 rounded-md"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? 'w-40 ml-2' : 'w-0'
            }`}
          >
            <div className="leading-4">
              <h4 className="font-medium text-sm">{user?.name}</h4>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <FiMoreVertical size={16} />
          </div>
        </div>
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClick: (e: any) => void;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, active, alert, onClick }) => {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error('SidebarItem must be used within a Sidebar');
  }

  const { expanded } = context;

  return (
    <li
      className={`
        relative flex items-center py-1.5 px-2 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? 'bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800'
            : 'hover:bg-indigo-50 text-gray-600'
        }
      `}
      onClick={onClick}
    >
      {icon}
      <span className={`overflow-hidden transition-all text-sm ${expanded ? 'w-40 ml-2' : 'w-0'}`}>{text}</span>
      {alert && (
        <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? '' : 'top-1'}`} />
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-4
            bg-indigo-100 text-indigo-800 text-xs
            invisible opacity-20 -translate-x-2 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
};

export default Sidebar;
