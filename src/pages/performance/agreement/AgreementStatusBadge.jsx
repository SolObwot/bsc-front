import React from 'react';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  XCircleIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

const AgreementStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { 
      label: 'Draft', 
      color: 'bg-gray-300 text-gray-700', 
      icon: ClockIcon 
    },
    pending_supervisor: { 
      label: 'Pending Supervisor', 
      color: 'bg-blue-100 text-blue-700', 
      icon: ClockIcon 
    },
    pending_hod: { 
      label: 'Pending HOD', 
      color: 'bg-purple-100 text-purple-700', 
      icon: ClockIcon 
    },
    approved_supervisor: {
      label: 'Supervisor Approved',
      color: 'bg-indigo-100 text-indigo-700',
      icon: UserCircleIcon
    },
    approved: { 
      label: 'Approved', 
      color: 'bg-green-100 text-green-700', 
      icon: CheckCircleIcon 
    },
    rejected: { 
      label: 'Rejected', 
      color: 'bg-red-100 text-red-700', 
      icon: XCircleIcon 
    }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

export default AgreementStatusBadge;