
import React from 'react';
import { Outlet } from 'react-router-dom';

const LeaveManagement = () => {
  return (
    <div>
      <h1>Leave Management</h1>
      <Outlet />
    </div>
  );
};

export default LeaveManagement;