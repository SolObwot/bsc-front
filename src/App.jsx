import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { RoleProvider } from './context/RoleContext';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import UsersList from './components/users/UsersList';
import Performance from './pages/Performance';
import LeaveManagement from './pages/LeaveManagement';
import BalanceScoreCard from './pages/BalanceScoreCard';
import LeaveRequests from './pages/LeaveRequests';
import LeaveApprovals from './pages/LeaveApprovals';
import LeaveReports from './pages/LeaveReports';
import LeaveSettings from './pages/LeaveSettings';
import AddUser from './components/users/AddUser';
import EditUser from './components/users/EditUser';
import RoleList from './components/admin/RoleList';
import RoleEdit from './components/admin/RoleEdit';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          
          {/* Protected routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            <Route path="/directory" element={<div>Directory Content</div>} />
            <Route path="/pim/employees" element={<div>Employee List</div>} />
            <Route path="/pim/employees/add" element={<div>Add Employee</div>} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/add" element={< AddUser />} />
            <Route path="/admin/users/edit/:id" element={<EditUser />} />
            <Route path="/admin/job-titles" element={<div>Job Titles</div>} />
            <Route path="/admin/organization" element={<div>Organization</div>} />
            <Route path="/admin/roles" element={<RoleList />} />
            <Route path="/admin/roles/edit/:id" element={<RoleEdit />} />
            <Route path="/performance" element={<Performance />}>
              <Route path="balance-score-card" element={<BalanceScoreCard />} />
              {/* Add more performance-related routes as needed */}
            </Route>
            <Route path="/leave-management" element={<LeaveManagement />}>
              <Route path="leave-requests" element={<LeaveRequests />} />
              <Route path="leave-approvals" element={<LeaveApprovals />} />
              <Route path="leave-reports" element={<LeaveReports />} />
              <Route path="leave-settings" element={<LeaveSettings />} />
            </Route>
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;

