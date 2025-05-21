import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import { RoleProvider } from './context/RoleContext';
import PrivateRoute from './components/auth/PrivateRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginForm from './components/auth/LoginForm';
import UsersList from './components/users/UsersList';
import Performance from './pages/Performance';
import LeaveManagement from './pages/LeaveManagement';
import BalanceScoreCard from './components/balancescorecard/Index';
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
import AwardsList from './pages/qualification/awards/AwardsList';
import UniversityList from './pages/qualification/university/UniversityList';
import AddUniversity from './pages/qualification/university/AddUniversity';
import EditUniversity from './pages/qualification/university/EditUniversity';
import RelationList from './pages/job/relation/RelationList';
import JobTitleList from './pages/job/jobtitle/JobTitleList';
import AddJobTitle from './pages/job/jobtitle/AddJobTitle';
import EditJobTitle from './pages/job/jobtitle/EditJobTitle';
import EmploymentStatusList from './pages/job/empstatus/EmploymentStatusList';
import DeparmentList from './pages/job/department/DeparmentList';
import UnitOrBranchList from './pages/job/unitorbranch/UnitOrBranchList';
import DistrictList from './pages/location/districts/DistrictList';
import CountyList from './pages/location/counties/CountyList';
import SubCountiesList from './pages/location/subcounties/SubCountiesList';
import ParishList from './pages/location/parish/ParishList';
import VillageList from './pages/location/village/VillageList';
import RegionList from './pages/location/regions/RegionList';
import TribeList from './pages/location/tribes/TribeList';
import CourseList from './pages/qualification/course/CourseList';
import AddCourse from './pages/qualification/course/AddCourse';
import EditCourse from './pages/qualification/course/EditCourse';
import TemplateList from './pages/performance/templates/TemplateList';
import AddTemplate from './pages/performance/templates/AddTemplate';
import EditTemplate from './pages/performance/templates/EditTemplate';
import AgreementList from './pages/performance/agreement/AgreementList.jsx';
import AgreementReview from './pages/performance/agreement/AgreementReview.jsx';
import AddAgreement from './pages/performance/agreement/AddAgreement';
import HODApproval from './pages/performance/agreement/HODApproval';
import SelfRating from './pages/performance/appraisals/SelfRating.jsx';
import RateAppraisalPage from './pages/performance/appraisals/RateAppraisalPage.jsx';
import SupervisorRating from './pages/performance/appraisals/SupervisorRating.jsx';
import BranchSupervisor from './pages/performance/appraisals/BranchSupervisor.jsx';
import PeerApproval from './pages/performance/appraisals/PeerApproval.jsx';
import BranchFinal from './pages/performance/appraisals/BranchFinal.jsx';
import HODAppraisalApproval from './pages/performance/appraisals/HODAppraisalApproval.jsx';
import Dashboard from './pages/Dashboard';
import PerformanceReport from './pages/performance/PerformanceReport';
import StrategicObjectiveList from './pages/performance/strategic_objectives/StrategicObjectiveList';
import AddStrategicObjective from './pages/performance/strategic_objectives/AddStrategicObjective';
import EditStrategicObjective from './pages/performance/strategic_objectives/EditStrategicObjective';
import SupervisorConfirmation from './pages/performance/confirmation/SupervisorConfirmation';
import HODConfirmation from './pages/performance/confirmation/HODConfirmation';
import PeerConfirmation from './pages/performance/confirmation/PeerConfirmation';
import FinalBranchConfirmation from './pages/performance/confirmation/FinalBranchConfirmation';
import ConfirmationForm from './pages/performance/confirmation/ConfirmationForm';

import React, { useEffect } from "react";
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <RoleProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            <Route path="/reset-password" element={<ResetPasswordForm />} />
            
            {/* Protected routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/directory" element={<div>Directory Content</div>} />
              <Route path="/pim/employees" element={<EmployeeList />} />
              <Route path="/pim/employees/add" element={<AddEmployee />} />
              <Route path="/pim/employees/profile/:id" element={<EmployeeProfile />} />
              <Route path="/pim/employees/profile/edit/:id" element={<UpdateProfile />} />
              <Route path="/admin/users" element={<UsersList />} />
              <Route path="/admin/users/add" element={<AddUser />} />
              <Route path="/admin/users/edit/:id" element={<EditUser />} />
              <Route path="/admin/roles" element={<RoleList />} />
              <Route path="/admin/roles/edit/:id" element={<RoleEdit />} />
              <Route path="/admin/qualification/course" element={<CourseList />} />
              <Route path="/admin/qualification/course/add" element={<AddCourse />} />
              <Route path="/admin/qualification/course/edit/:id" element={<EditCourse />} />
              <Route path="/admin/qualification/university" element={<UniversityList />} /> 
              <Route path="/admin/qualification/university/add" element={<AddUniversity />} />
              <Route path="/admin/qualification/university/edit/:id" element={<EditUniversity />} />
              <Route path="/admin/qualification/awards" element={<AwardsList />} />
              <Route path="/admin/job/relation" element={<RelationList />} />
              <Route path="/admin/job/jobtitle" element={<JobTitleList />} />
              <Route path="/admin/job/jobtitle/add" element={<AddJobTitle />} />
              <Route path="/admin/job/jobtitle/edit/:id" element={<EditJobTitle />} />
              <Route path="/admin/job/employment-status" element={<EmploymentStatusList />} />
              <Route path="/admin/job/departments" element={<DeparmentList />} />
              <Route path="/admin/job/unit-branch" element={<UnitOrBranchList />} />
              <Route path="/admin/job/grade-scale" element={<div>Grade or Scale Content</div>} />
              <Route path="/admin/location/districts" element={<DistrictList />} />
              <Route path="/admin/location/counties" element={<CountyList />} />
              <Route path="/admin/location/subcounties" element={<SubCountiesList />} />
              <Route path="/admin/location/parish" element={<ParishList />} />
              <Route path="/admin/location/village" element={<VillageList />} />
              <Route path="/admin/location/regions" element={<RegionList />} />
              <Route path="/admin/location/tribes" element={<TribeList />} />
              <Route path="/performance" element={<Performance />}>
                <Route path="balance-score-card" element={<BalanceScoreCard />} />
                <Route path="templates" element={<TemplateList />} />
                <Route path="templates/list" element={<TemplateList />} />
                <Route path="templates/add" element={<AddTemplate />} />
                <Route path="templates/edit/:id" element={<EditTemplate />} />

                <Route path="agreement/list" element={<AgreementList />} />
                <Route path="agreement/new" element={<AddAgreement />} />
                <Route path="agreement/edit/:id" element={<AddAgreement />} />
                <Route path="agreement/review" element={<AgreementReview />} />
                <Route path="agreement/hod-approval" element={<HODApproval />} />
                <Route path="agreement/approval/:id" element={<AgreementReview />} />

                <Route path="rating/self" element={<SelfRating />} />
                <Route path="rating/self/edit/:id" element={<RateAppraisalPage />} />
                <Route path="rating/supervisor" element={<SupervisorRating />} />
                <Route path="rating/supervisor/edit/:id" element={<RateAppraisalPage />} />
                <Route path="rating/branch" element={<BranchSupervisor />} />
                <Route path="rating/branch/edit/:id" element={<RateAppraisalPage />} />
                <Route path="rating/hod" element={<HODAppraisalApproval />} />
                <Route path="rating/peer" element={<PeerApproval />} />
                <Route path="rating/final" element={<BranchFinal />} />

                <Route path="confirmation/supervisor" element={<SupervisorConfirmation />} />
                <Route path="confirmation/hod" element={<HODConfirmation />} />
                <Route path="confirmation/peer" element={<PeerConfirmation />} />
                <Route path="confirmation/final" element={<FinalBranchConfirmation />} />
                <Route path="confirmation/edit/:id" element={<ConfirmationForm />} />

                <Route path="reports" element={<PerformanceReport />} />
                <Route path="strategic-objectives" element={<StrategicObjectiveList />} />
                <Route path="strategic-objectives/add" element={<AddStrategicObjective />} />
                <Route path="strategic-objectives/edit/:id" element={<EditStrategicObjective />} />
              </Route>
              <Route path="/leave-management" element={<LeaveManagement />}>
                <Route path="leave-requests" element={<LeaveRequests />} />
                <Route path="leave-approvals" element={<LeaveApprovals />} />
                <Route path="leave-reports" element={<LeaveReports />} />
                <Route path="leave-settings" element={<LeaveSettings />} />
              </Route>
              <Route path="/profile" element={<div>My Profile Content</div>} />
              <Route path="/info" element={<div>My Info Content</div>} />
              <Route path="/change-password" element={<ChangePasswordForm />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Routes>
        </RoleProvider>
      </AuthProvider>
    </>
  );
}

export default App;

