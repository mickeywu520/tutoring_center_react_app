import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiCalendar, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const { logout } = useAuth();

  return (
    <>
      {/* Mobile Menu Button */}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed top-4 left-4 z-20 p-2 bg-gray-800 text-white rounded-full md:hidden">
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar */}
      <div className={`bg-brand-primary text-gray-200 w-64 space-y-6 py-7 px-4 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-10 shadow-lg`}>
        <div className="px-4 mb-10 text-center">
            <h2 className="text-2xl font-bold text-white">補課系統</h2>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center py-3 px-4 rounded-lg transition duration-200 bg-brand-accent text-white font-semibold">
            <FiHome className="mr-3 text-lg" />
            主控台
          </a>
          <a href="#" className="flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-gray-700 hover:text-white">
            <FiCalendar className="mr-3 text-lg" />
            我的課程
          </a>
        </nav>

        <div className="absolute bottom-0 w-full left-0 px-4 py-5">
            <button onClick={logout} className="flex items-center justify-center w-full py-3 px-4 rounded-lg transition duration-200 bg-red-500/80 hover:bg-red-500 text-white font-semibold">
                <FiLogOut className="mr-3 text-lg" />
                登出
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
