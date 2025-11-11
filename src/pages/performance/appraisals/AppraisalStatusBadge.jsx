import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

const AppraisalStatusBadge = ({ status }) => {
  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-gray-300 text-gray-700",
      icon: ClockIcon,
    },
    submitted: {
      label: "Submitted",
      color: "bg-blue-100 text-blue-700",
      icon: PaperAirplaneIcon,
    },
    supervisor_reviewed: {
      label: "Supervisor Reviewed",
      color: "bg-purple-100 text-purple-700",
      icon: UserCircleIcon,
    },
    peer_reviewed: {
      label: "Peer Reviewed",
      color: "bg-indigo-100 text-indigo-700",
      icon: UserCircleIcon,
    },
    branch_reviewed: {
      label: "Branch Reviewed",
      color: "bg-teal-100 text-teal-700",
      icon: UserCircleIcon,
    },
    hod_reviewed: {
      label: "HOD Reviewed",
      color: "bg-orange-100 text-orange-700",
      icon: UserCircleIcon,
    },
    rejected: {
      label: "Rejected",
      color: "bg-red-100 text-red-700",
      icon: XCircleIcon,
    },
    completed: {
      label: "Completed",
      color: "bg-green-100 text-green-700",
      icon: CheckCircleIcon,
    },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}
    >
      <Icon className="w-3.5 h-3.5 mr-1" />
      {config.label}
    </span>
  );
};

export default AppraisalStatusBadge;
