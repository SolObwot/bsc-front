import React from 'react';
import { Outlet } from 'react-router-dom';

const Performance = () => {
  return (
    <div>
      <h1>Performance</h1>
      <Outlet />
    </div>
  );
};

export default Performance;
