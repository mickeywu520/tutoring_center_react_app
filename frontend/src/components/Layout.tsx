import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // Default: closed on mobile, open on desktop
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Check if desktop on mount
  React.useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) { // md breakpoint
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen bg-brand-background font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top padding for mobile menu button */}
        <div className="md:hidden h-16"></div>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-background p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
