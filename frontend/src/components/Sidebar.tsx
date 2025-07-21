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
        className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-2xl transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 md:translate-x-0 md:relative md:w-64`}
      >
        {/* Close button inside sidebar for mobile */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors md:hidden"
          style={{ zIndex: 60 }}
        >
          <FiX size={20} />
        </button>

        <div className="flex flex-col h-full pt-16 md:pt-8">
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">補課系統</h2>
          </div>

          <nav className="flex-1 px-6 py-4">
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiHome className="mr-3" size={20} />
                  主控台
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiCalendar className="mr-3" size={20} />
                  我的課程
                </a>
              </li>
            </ul>
          </nav>

          <div className="px-6 py-4 border-t border-gray-700">
            <button
              onClick={logout}
              className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              <FiLogOut className="mr-3" size={20} />
              登出
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;