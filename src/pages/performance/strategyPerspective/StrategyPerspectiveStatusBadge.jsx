import React from 'react';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

const StrategyPerspectiveStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: ExclamationCircleIcon },
    pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700', icon: ExclamationCircleIcon },
    rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700', icon: ExclamationCircleIcon },
    approved: { label: 'Approved', color: 'bg-green-100 text-green-700', icon: CheckCircleIcon }
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}>
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

export default StrategyPerspectiveStatusBadge;
