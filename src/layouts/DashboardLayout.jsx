import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Check for authentication
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Handle loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Generate breadcrumbs based on current location
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(Boolean);
    return [
      { label: 'Home', href: '/dashboard' },
      ...paths.map((path, index) => ({
        label: path.charAt(0).toUpperCase() + path.slice(1),
        href: `/${paths.slice(0, index + 1).join('/')}`,
      })),
    ];
  };

  // If not authenticated, don't render anything (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <style>
        {`
          /* Hide scrollbar for Chrome, Safari and Opera */
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }

          /* Hide scrollbar for IE, Edge and Firefox */
          .no-scrollbar {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
          }
        `}
      </style>
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:transform-none lg:relative ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar 
          isMobile={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen} 
          user={user}
          onLogout={logout}
        />
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden h-full w-full">
        <Navbar
          breadcrumbs={generateBreadcrumbs()}
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
        />
        
        <main className="flex flex-1 flex-col overflow-y-auto bg-sky-100 ">
          <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="h-full flex flex-col">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;