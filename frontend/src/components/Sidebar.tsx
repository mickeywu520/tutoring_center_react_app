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
      {/* Mobile Overlay - covers entire screen */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 md:hidden"
          style={{ zIndex: 40 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Menu Button - only show when sidebar is closed */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          className="fixed top-4 left-4 z-50 p-3 bg-black bg-opacity-70 text-white rounded-lg shadow-lg md:hidden hover:bg-opacity-90 transition-all"
        >
          <FiMenu size={20} />
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`bg-primary-blue-700 text-neutral-gray-200 w-64 space-y-6 py-7 px-4 fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl md:shadow-none`}
        style={{ zIndex: 50 }}
      >
        {/* Close button inside sidebar for mobile */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors md:hidden"
          style={{ zIndex: 60 }}
        >
          <FiX size={20} />
        </button>

        <div className="px-4 mb-10 text-center mt-8 md:mt-0">
            <h2 className="text-2xl font-bold text-neutral-white">補課系統</h2>
        </div>
        
        <nav className="space-y-2">
          <a href="#" className="flex items-center py-3 px-4 rounded-lg transition duration-200 bg-primary-blue-500 text-white font-semibold">
            <FiHome className="mr-3 text-lg" />
            主控台
          </a>
          <a href="#" className="flex items-center py-3 px-4 rounded-lg transition duration-200 hover:bg-primary-blue-600 hover:text-white text-neutral-gray-200">
            <FiCalendar className="mr-3 text-lg" />
            我的課程
          </a>
        </nav>

        <div className="absolute bottom-0 w-full left-0 px-4 py-5">
            <button onClick={logout} className="flex items-center justify-center w-full py-3 px-4 rounded-lg transition duration-200 bg-red-600 hover:bg-red-700 text-neutral-white font-semibold">
                <FiLogOut className="mr-3 text-lg" />
                登出
            </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
