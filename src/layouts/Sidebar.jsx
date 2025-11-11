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
  CalendarIcon,
  DocumentTextIcon, 
  ChatBubbleLeftRightIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

const navigationItems = [
  { 
    label: 'Dashboard', 
    icon: HomeIcon, 
    href: '/dashboard' 
  },
  // { 
  //   label: 'Directory', 
  //   icon: UsersIcon, 
  //   href: '/directory' 
  // },
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
      { label: 'Roles & Permissions', href: '/admin/roles' },
      { 
        label: 'Qualification', 
        href: '/',
        children: [
          { label: 'Courses', href: '/admin/qualification/course' },
          // { label: 'Awards', href: '/admin/qualification/awards' },
          { label: 'University', href: '/admin/qualification/university' },
        ]
      },
      { 
        label: 'Job', 
        href: '/',
        children: [
          { label: 'Job Title', href: '/admin/job/jobtitle' },
          { label: 'Grade or Scale', href: '/admin/job/grade-scale' },
          { label: 'Employment Status', href: '/admin/job/employment-status' },
          { label: 'Departments', href: '/admin/job/departments' },
          { label: 'Relation', href: '/admin/job/relation' },
          { label: 'Unit or Branch', href: '/admin/job/unit-branch' },
        ]
      },
      { 
        label: 'Location', 
        href: '/',
        children: [
          { label: 'Districts', href: '/admin/location/districts' },
          { label: 'Counties', href: '/admin/location/counties' },
          { label: 'Subcounties', href: '/admin/location/subcounties' },
          { label: 'Parish', href: '/admin/location/parish' },
          { label: 'Village', href: '/admin/location/village' },
          { label: 'Regions', href: '/admin/location/regions' },
          { label: 'Tribes', href: '/admin/location/tribes' },
        ]
      },
    ]
  },
  { 
    label: 'Performance', 
    icon: ChartBarIcon, 
    href: '/',
    children: [
      { 
        label: 'Templates', 
        href: '/',
        children: [
          { label: 'Template List', href: '/performance/templates/list' },
          { label: 'Setup Templates', href: '/performance/templates' },
        ]
      
      },
      { 
        label: 'Agreement', 
        href: '/',
        children: [
          { label: 'Setup Agreement', href: '/performance/agreement/list' },
          { label: 'Agreement Review', href: '/performance/agreement/review' },
          { label: 'HOD Approval', href: '/performance/agreement/hod-approval' },
        ]
      
      },
      // { label: 'Setup KPI', href: '/performance/balance-score-card' },
      { 
        label: 'Appraisals', 
        href: '/' ,
        children: [
          { label: 'Self Rating', href: '/performance/rating/self' },
          { label: 'Supervisor Rating', href: '/performance/rating/supervisor' },
          // {label: 'Overall Assessment ', href: '/performance/rating/overall'},
          // { label: 'Appraisal Agreement', href: '/performance/rating/agreement' },
          { label: 'HOD Approval', href: '/performance/rating/hod' },
          {label: 'Branch Immediate Supervisor', href: '/performance/rating/branch'},
          { label: 'Peer Approval', href: '/performance/rating/peer' },
          { label: 'Branch Final Assesement', href: '/performance/rating/final' },
        ]
      
      },
      { 
        label: 'Confirmation', 
        href: '/' ,
        children: [
          { label: 'Supervisor Confirmation', href: '/performance/confirmation/supervisor' },
          { label: 'HOD Confirmation', href: '/performance/confirmation/hod' },
          { label: 'Peer Approval', href: '/performance/confirmation/peer' },
          { label: 'Branch Final Confirmation', href: '/performance/confirmation/final' },
        ]
      
      },
      { label: 'Setup Strategic Objectives', href: '/performance/strategic-objectives' },
      { label: 'Assign Perspective Weight', href: '/performance/strategic-perspectives' },
      { label: 'Performance Reports', href: '/performance/reports' },
      // { label: 'Surveys', href: '/performance/surveys' },
      // Add more performance-related items as needed
    ]
  },
  // New section for Annual Execution Undertaking Forms
  { 
    label: 'Annual Execution Undertaking', 
    icon: DocumentTextIcon, 
    href: '/',
    children: [
      { label: 'View Forms', href: '/hr/annual-undertaking/view' },
      { label: 'Add Undertaking Form', href: '/hr/annual-undertaking/create' },
      // { label: 'Manage Templates', href: '/hr/annual-undertaking/templates' },
      // { label: 'Review Submissions', href: '/hr/annual-undertaking/review' },
      // { label: 'Reports', href: '/hr/annual-undertaking/reports' },
    ]
  },
  // New section for HR Policy Summarization with AI interaction
  { 
    label: 'HR Policy Assistant', 
    icon: ChatBubbleLeftRightIcon, 
    href: '/',
    children: [
      { label: 'Policy Explorer', href: '/hr/policy/explorer' },
      { label: 'Chat with Policy', href: '/hr/policy/chat' },
      { label: 'Upload Documents', href: '/hr/policy/upload' },
      { label: 'Saved Conversations', href: '/hr/policy/saved-chats' },
    ]
  },
  // { 
  //   label: 'Leave Management', 
  //   icon: CalendarIcon, 
  //   href: '/',
  //   children: [
  //     { label: 'Leave Requests', href: '/leave-management/leave-requests' },
  //     { label: 'Leave Approvals', href: '/leave-management/leave-approvals' },
  //     { label: 'Leave Reports', href: '/leave-management/leave-reports' },
  //     { label: 'Leave Settings', href: '/leave-management/leave-settings' },
  //   ]
  // },
];

const Sidebar = ({ isMobile, setMobileMenuOpen, user, onLogout }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSubmenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const isActive = (href) => {
    return location.pathname === href;
  };

  // Safe user data access
  const getUserDisplayName = () => {
    if (!user) return 'User Account';
    
    if (user.surname && user.first_name) {
      return `${user.surname} ${user.first_name}`;
    } else if (user.name) {
      return user.name;
    } else if (user.username) {
      return user.username;
    } else if (user.email) {
      return user.email.split('@')[0];
    }
    
    return 'User Account';
  };

  const getUserEmail = () => {
    return user?.email || 'user@example.com';
  };

  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const hasChildren = item.children?.length > 0;
    const isOpen = openMenus[item.label];

    return (
      <>
        <div
          className={`flex items-center justify-between w-full p-2 ${
            isActive(item.href)
              ? 'bg-blue-50 text-[#c69214]'
              : 'text-white hover:bg-gray-100 hover:text-[#c69214]'
          } rounded-lg cursor-pointer`}
          onClick={() => hasChildren ? toggleSubmenu(item.label) : null}
        >
          <Link
            to={hasChildren ? '#' : item.href}
            className="flex items-center flex-1"
            onClick={(e) => {
              if (!hasChildren && isMobile) {
                setMobileMenuOpen(false);
              }
              if (hasChildren) {
                e.preventDefault();
              }
            }}
          >
            {Icon && <Icon className="w-5 h-5 mr-3" />}
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
              <div key={index}>
                <div
                  className={`flex items-center justify-between w-full p-2 ${
                    isActive(child.href)
                      ? 'bg-blue-50 text-[#c69214]'
                      : 'text-white hover:bg-gray-100 hover:text-[#c69214]'
                  } rounded-lg cursor-pointer`}
                  onClick={() =>
                    child.children ? toggleSubmenu(child.label) : null
                  }
                >
                  <Link
                    to={child.children ? '#' : child.href}
                    className="flex items-center flex-1"
                    onClick={(e) => {
                      if (!child.children && isMobile) {
                        setMobileMenuOpen(false);
                      }
                      if (child.children) {
                        e.preventDefault();
                      }
                    }}
                  >
                    <span className="text-sm font-medium">{child.label}</span>
                  </Link>
                  {child.children && (
                    <ChevronDownIcon
                      className={`w-4 h-4 transition-transform ${
                        openMenus[child.label] ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </div>

                {child.children && openMenus[child.label] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {child.children.map((nestedChild, nestedIndex) => (
                      <Link
                        key={nestedIndex}
                        to={nestedChild.href}
                        className={`block p-2 text-sm ${
                          isActive(nestedChild.href)
                            ? 'text-[#c69214] bg-blue-50'
                            : 'text-white hover:bg-gray-100 hover:text-[#c69214]'
                        } rounded-lg`}
                        onClick={() => isMobile && setMobileMenuOpen(false)}
                      >
                        {nestedChild.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-200 overflow-y-auto bg-[#08796c]">
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
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <div className="flex-shrink-0">
              <UserCircleIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {getUserDisplayName()}
              </p>
              <p className="text-sm text-gray-300 truncate">
                {getUserEmail()}
              </p>
            </div>
            <ChevronDownIcon 
              className={`w-5 h-5 text-white transition-transform ${
                isUserMenuOpen ? 'transform rotate-180' : ''
              }`} 
            />
          </div>
          
          {isUserMenuOpen && (
            <div className="mt-2 space-y-1">
              <Link 
                to="/profile" 
                className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg transition-colors"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (isMobile) setMobileMenuOpen(false);
                }}
              >
                My Profile
              </Link>
              <Link 
                to="/info" 
                className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg transition-colors"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (isMobile) setMobileMenuOpen(false);
                }}
              >
                My Info
              </Link>
              <Link 
                to="/change-password" 
                className="block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg transition-colors"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  if (isMobile) setMobileMenuOpen(false);
                }}
              >
                Change Password
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setIsUserMenuOpen(false);
                  if (isMobile) setMobileMenuOpen(false);
                }}
                className="w-full text-left block p-2 text-sm text-white hover:bg-gray-100 hover:text-[#009a44] rounded-lg transition-colors"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 inline mr-2" />
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