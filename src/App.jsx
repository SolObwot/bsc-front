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
import ForgotPasswordForm from './components/auth/ForgotPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ChangePasswordForm from './components/auth/ChangePasswordForm';
import EmployeeList from './pages/pim/EmployeeList';
import EmployeeProfile from './pages/pim/EmployeeProfile';
import UpdateProfile from './pages/pim/UpdateProfile';
import AddEmployee from './pages/pim/AddEmployee';
import QualificationList from './pages/qualification/QualificationList';
import QualificationForm from './pages/qualification/QualificationForm';
import CourseList from './pages/admin/qualification/CourseList';
import CourseForm from './pages/admin/qualification/CourseForm';
// import AwardsList from './pages/admin/qualification/AwardsList';
// import AwardsForm from './pages/admin/qualification/AwardsForm';
// import UniversityList from './pages/admin/qualification/UniversityList';
// import UniversityForm from './pages/admin/qualification/UniversityForm';
// import JobList from './pages/job/JobList';
// import JobForm from './pages/job/JobForm';
// import LocationList from './pages/location/LocationList';
// import LocationForm from './pages/location/LocationForm';

function App() {
  return (
    <AuthProvider>
      <RoleProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
          
          {/* Protected routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
            <Route path="/directory" element={<div>Directory Content</div>} />
            <Route path="/pim/employees" element={<EmployeeList />} />
            <Route path="/pim/employees/add" element={<AddEmployee />} />
            <Route path="/pim/employees/profile/:id" element={<EmployeeProfile />} />
            <Route path="/pim/employees/profile/edit/:id" element={<UpdateProfile />} />
            <Route path="/admin/users" element={<UsersList />} />
            <Route path="/admin/users/add" element={< AddUser />} />
            <Route path="/admin/users/edit/:id" element={<EditUser />} />
            <Route path="/admin/job-titles" element={<div>Job Titles</div>} />
            <Route path="/admin/organization" element={<div>Organization</div>} />
            <Route path="/admin/roles" element={<RoleList />} />
            <Route path="/admin/roles/edit/:id" element={<RoleEdit />} />
            <Route path="/admin/qualification/:type" element={<QualificationList />} />
            <Route path="/admin/qualification/:type/add" element={<QualificationForm />} />
            <Route path="/admin/qualification/course" element={<CourseList />} />
            <Route path="/admin/qualification/course/add" element={<CourseForm />} />
            {/* <Route path="/admin/qualification/awards" element={<AwardsList />} />
            <Route path="/admin/qualification/awards/add" element={<AwardsForm />} />
            <Route path="/admin/qualification/university" element={<UniversityList />} />
            <Route path="/admin/qualification/university/add" element={<UniversityForm />} /> */}
            {/* <Route path="/admin/job/:type" element={<JobList />} />
            <Route path="/admin/job/:type/add" element={<JobForm />} />
            <Route path="/admin/location/:type" element={<LocationList />} />
            <Route path="/admin/location/:type/add" element={<LocationForm />} /> */}
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
            <Route path="/change-password" element={<ChangePasswordForm />} />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </RoleProvider>
    </AuthProvider>
  );
}

export default App;

