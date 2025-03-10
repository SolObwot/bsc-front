import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  UserCircleIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const navigationItems = [
  { 
    label: 'Dashboard', 
    icon: HomeIcon, 
    href: '/dashboard' 
  },
  { 
    label: 'Directory', 
    icon: UsersIcon, 
    href: '/directory' 
  },
  { 
    label: 'PIM', 
    icon: BriefcaseIcon, 
    href: '/',
    children: [
      { label: 'Employee List', href: '/pim/employees' },
      { label: 'Add Employee', href: '/pim/employees/add' },
    ]
  },
  { 
    label: 'Admin', 
    icon: Cog6ToothIcon, 
    href: '/',
    children: [
      { label: 'User Management', href: '/admin/users' },
      { label: 'Roles & Permissions', href: '/admin/roles'},
    ]
  },
  { 
    label: 'Performance', 
    icon: ChartBarIcon, 
    href: '/',
    children: [
      { label: 'Balanced Scorecard', href: '/performance/balance-score-card' },
      // Add more performance-related items as needed
    ]
  },
  { 
    label: 'Leave Management', 
    icon: CalendarIcon, 
    href: '/',
    children: [
      { label: 'Leave Requests', href: '/leave-management/leave-requests' },
      { label: 'Leave Approvals', href: '/leave-management/leave-approvals' },
      { label: 'Leave Reports', href: '/leave-management/leave-reports' },
      { label: 'Leave Settings', href: '/leave-management/leave-settings' },
    ]
  },
];

const Sidebar = ({ isMobile, setMobileMenuOpen }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState({});

  const toggleSubmenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const activeClass = isActive(item.href) ? 'text-[#c69214]' : '';
    const hasChildren = item.children?.length > 0;
    const isOpen = openMenus[item.label];
    
    return (
      <>
        <div
          className={`flex items-center justify-between w-full p-2 ${
            isActive(item.href)
              ? 'bg-blue-50 text-[#c69214 ]'
              : 'text-white hover:bg-gray-100 hover:text-[#c69214]'
          } rounded-lg cursor-pointer`}
          onClick={() => hasChildren ? toggleSubmenu(item.label) : null}
        >
          <Link
            to={item.href}
            className="flex items-center flex-1"
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <Icon className="w-5 h-5 mr-3" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
          {hasChildren && (
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`}
            />
          )}
        </div>
        
        {hasChildren && isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {item.children.map((child, index) => (
              <Link
                key={index}
                to={child.href}
                className={`block p-2 text-sm ${
                  isActive(child.href)
                    ? 'text-[#c69214] bg-blue-50'
                    : 'text-white hover:bg-gray-100 hover:text-[#c69214]'
                } rounded-lg`}
                onClick={() => isMobile && setMobileMenuOpen(false)}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </>
    );
  };

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 overflow-y-auto bg-[#00A7B5]">
      <div className="h-full flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-semibold text-white">PRIDE HRMS</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item, index) => (
            <NavItem key={index} item={item} />
          ))}
        </nav>

        {/* User Account Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
            <div className="flex-shrink-0">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {`${user?.first_name} ${user?.last_name}` || 'Full Name'}
              </p>
              <p className="text-sm text-gray-300 truncate">
                {user?.email || 'email@example.com'}
              </p>
            </div>
            <ChevronDownIcon className={`w-5 h-5 text-white transition-transform ${isUserMenuOpen ? 'transform rotate-180' : ''}`} />
          </div>
          {isUserMenuOpen && (
            <div className="mt-2 space-y-1 hover:text-[#009a44]">
              <Link to="/profile" className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg">
                My Profile
              </Link>
              <Link to="/info" className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg">
                My Info
              </Link>
              <Link to="/change-password" className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg">
                Change Password
              </Link>
              <button
                onClick={logout}
                className="w-full text-left block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 inline mr-2 text-white hover:text-[#009a44]" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;