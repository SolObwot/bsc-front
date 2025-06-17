import React from 'react';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/20/solid';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: ClockIcon },
    submitted: { label: 'Submitted for Review', color: 'bg-blue-100 text-blue-700', icon: ClockIcon },
    pending_supervisor: { label: 'Pending Supervisor', color: 'bg-amber-100 text-amber-700', icon: ClockIcon },
    pending_hod: { label: 'Pending HOD', color: 'bg-purple-100 text-purple-700', icon: ClockIcon },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon },
    rejected_by_supervisor: { label: 'Rejected by Supervisor', color: 'bg-red-100 text-red-700', icon: ClockIcon },
    rejected_by_hod: { label: 'Rejected by HOD', color: 'bg-red-100 text-red-700', icon: ClockIcon }
    // Add other statuses as needed
  };

  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-700', icon: ClockIcon };
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      {Icon && <Icon className="w-3.5 h-3.5 mr-1" />}
      {config.label}
    </span>
  );
};

export default StatusBadge;
