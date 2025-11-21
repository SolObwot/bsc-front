import React from "react";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const formatLabel = (value) =>
  (value || "")
    .toString()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const AppraisalStatusBadge = ({ status, action }) => {
  const normalizedStatus = (status || "").toLowerCase();

  const statusConfig = {
    draft: {
      label: "Draft",
      color: "bg-slate-200 text-slate-700",
      icon: ClockIcon,
    },
    supervisor: {
      label: "Supervisor Review",
      color: "bg-purple-100 text-purple-700",
      icon: UserCircleIcon,
    },
    employee_review: {
      label: "Employee Review",
      color: "bg-blue-100 text-blue-700",
      icon: UserCircleIcon,
    },
    hod: {
      label: "HOD Review",
      color: "bg-orange-100 text-orange-700",
      icon: ShieldCheckIcon,
    },
    branch_supervisor: {
      label: "Branch Supervisor",
      color: "bg-emerald-100 text-emerald-700",
      icon: UserGroupIcon,
    },
    peer_approval: {
      label: "Peer Approval",
      color: "bg-indigo-100 text-indigo-700",
      icon: UserGroupIcon,
    },
    branch_final_assessment: {
      label: "Branch Final Assessment",
      color: "bg-teal-100 text-teal-700",
      icon: ShieldCheckIcon,
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

  const fallbackConfig = {
    label: formatLabel(status) || "Draft",
    color: "bg-slate-200 text-slate-700",
    icon: ClockIcon,
  };

  const config = statusConfig[normalizedStatus] || fallbackConfig;
  const Icon = config.icon;

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <span
        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${config.color}`}
      >
        <Icon className="mr-1 h-3.5 w-3.5" />
        {config.label}
      </span>
      {action && (
        <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-600">
          {formatLabel(action)}
        </span>
      )}
    </div>
  );
};

export default AppraisalStatusBadge;
