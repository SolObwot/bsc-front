import { Bars3Icon } from '@heroicons/react/24/outline';
import Breadcrumb from '../components/ui/Breadcrumb';

const Navbar = ({ breadcrumbs = [], onMenuClick }) => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed z-30 w-full">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start">
            <button
              onClick={onMenuClick}
              className="lg:hidden mr-2 text-gray-600 hover:text-gray-900"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            <div className="ml-4">
              <Breadcrumb items={breadcrumbs} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;