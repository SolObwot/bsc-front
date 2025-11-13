import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHead,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../../components/ui/Tables";
import ObjectiveHeader from "../../../components/balancescorecard/Header";
import OverallProgress from "../../../components/balancescorecard/OverallProgress";
import FilterBox from "../../../components/ui/FilterBox";
import Button from "../../../components/ui/Button";
import {
  DocumentPlusIcon,
  ClockIcon,
  CheckCircleIcon,
  PencilIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
} from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import AppraisalActions from "./AppraisalActions";
import AppraisalToolbar from "./AppraisalToolbar";
import Pagination from "../../../components/ui/Pagination";
import SubmitConfirmationModal from "./SubmitAppraisalModal";
import OverallAssessmentModal from "./OverallAssessmentModal";

// Status badge component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending_rating: {
      label: "Pending Rating",
      color: "bg-gray-100 text-gray-700",
      icon: ClockIcon,
    },
    in_progress: {
      label: "Rating In Progress",
      color: "bg-blue-100 text-blue-700",
      icon: PencilIcon,
    },
    submitted: {
      label: "Submitted to Supervisor",
      color: "bg-green-100 text-green-700",
      icon: CheckCircleIcon,
    },
    supervisor_reviewed: {
      label: "Supervisor Reviewed",
      color: "bg-purple-100 text-purple-700",
      icon: DocumentCheckIcon,
    },
    user_accepted: {
      label: "You Accepted Rating",
      color: "bg-teal-100 text-teal-700",
      icon: CheckCircleIcon,
    },
    user_rejected: {
      label: "You Rejected Rating",
      color: "bg-red-100 text-red-700",
      icon: XMarkIcon,
    },
    pending_hod: {
      label: "Pending HOD Approval",
      color: "bg-amber-100 text-amber-700",
      icon: ClockIcon,
    },
  };

  const config = statusConfig[status] || statusConfig.pending_rating;
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

const SelfRating = () => {
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Modal states
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedAppraisal, setSelectedAppraisal] = useState(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // Sample appraisal data
  const [appraisals, setAppraisals] = useState([
    {
      id: 1,
      agreementTitle: "Performance Agreement 2025",
      agreementId: 1,
      period: "Annual Review",
      createdDate: "2025-05-01",
      submittedDate: null,
      status: "pending_rating",
      indicators: [
        {
          id: 101,
          name: "Revenue Growth Rate",
          targetValue: "15%",
          actualValue: "",
          weight: "15%",
          self_rating: "",
          supervisor_rating: "",
          measurement_type: "percentage",
        },
        {
          id: 102,
          name: "Customer Satisfaction Score",
          targetValue: "4.5",
          actualValue: "",
          weight: "10%",
          self_rating: "",
          supervisor_rating: "",
          measurement_type: "number",
        },
        {
          id: 103,
          name: "Employee Retention Rate",
          targetValue: "90%",
          actualValue: "",
          weight: "10%",
          self_rating: "",
          supervisor_rating: "",
          measurement_type: "percentage",
        },
      ],
    },
    {
      id: 2,
      agreementTitle: "Performance Agreement 2024",
      agreementId: 2,
      period: "Probation 6 months",
      createdDate: "2023-12-10",
      submittedDate: "2024-01-05",
      status: "in_progress",
      indicators: [
        {
          id: 201,
          name: "New Product Launch",
          targetValue: "2024-06-30",
          actualValue: "",
          weight: "20%",
          self_rating: "4",
          supervisor_rating: "",
          measurement_type: "date",
        },
        {
          id: 202,
          name: "Cost Reduction",
          targetValue: "10%",
          actualValue: "",
          weight: "15%",
          self_rating: "",
          supervisor_rating: "",
          measurement_type: "percentage",
        },
      ],
    },
    {
      id: 3,
      agreementTitle: "Performance Agreement 2023",
      agreementId: 3,
      period: "Annual Review",
      createdDate: "2023-01-15",
      submittedDate: "2023-12-15",
      status: "submitted",
      indicators: [
        {
          id: 301,
          name: "Market Share Growth",
          targetValue: "5%",
          actualValue: "6%",
          weight: "25%",
          self_rating: "5",
          supervisor_rating: "4",
          measurement_type: "percentage",
        },
        {
          id: 302,
          name: "Team Training Hours",
          targetValue: "40",
          actualValue: "35",
          weight: "10%",
          self_rating: "3",
          supervisor_rating: "3",
          measurement_type: "number",
        },
      ],
    },
    {
      id: 4,
      agreementTitle: "Performance Agreement 2022",
      agreementId: 4,
      period: "Annual Review",
      createdDate: "2022-01-10",
      submittedDate: "2022-12-10",
      reviewedDate: "2023-01-15",
      status: "supervisor_reviewed",
      totalPartA: "78",
      totalPartB: "85",
      totalScore: "84",
      employeeName: "John Smith",
      employeeTitle: "Senior Developer",
      department: "Information Technology",
      branch: "Head Office",
      indicators: [
        {
          id: 401,
          name: "Sales Revenue",
          targetValue: "$1M",
          actualValue: "$1.2M",
          weight: "30%",
          self_rating: "5",
          supervisor_rating: "4",
          measurement_type: "currency",
        },
        {
          id: 402,
          name: "Customer Retention",
          targetValue: "85%",
          actualValue: "87%",
          weight: "20%",
          self_rating: "4",
          supervisor_rating: "4",
          measurement_type: "percentage",
        },
        {
          id: 403,
          name: "Project Completion",
          targetValue: "12",
          actualValue: "10",
          weight: "15%",
          self_rating: "3",
          supervisor_rating: "3",
          measurement_type: "number",
        },
      ],
    },
    {
      id: 5,
      agreementTitle: "Performance Agreement 2023 Q3",
      agreementId: 5,
      period: "Quarterly Review",
      createdDate: "2023-07-01",
      submittedDate: "2023-10-05",
      reviewedDate: "2023-10-12",
      status: "user_accepted",
      totalPartA: "82",
      totalPartB: "88",
      totalScore: "85",
      employeeName: "Sarah Johnson",
      employeeTitle: "Marketing Manager",
      department: "Marketing",
      branch: "Head Office",
      indicators: [
        {
          id: 501,
          name: "Marketing Campaign ROI",
          targetValue: "25%",
          actualValue: "27%",
          weight: "20%",
          self_rating: "4",
          supervisor_rating: "4",
          measurement_type: "percentage",
        },
        {
          id: 502,
          name: "Lead Generation",
          targetValue: "500",
          actualValue: "520",
          weight: "15%",
          self_rating: "4",
          supervisor_rating: "5",
          measurement_type: "number",
        },
      ],
    },
    {
      id: 6,
      agreementTitle: "Performance Agreement 2023 Q2",
      agreementId: 6,
      period: "Quarterly Review",
      createdDate: "2023-04-01",
      submittedDate: "2023-07-05",
      reviewedDate: "2023-07-10",
      status: "user_rejected",
      rejectionReason:
        "Requested reconsideration of project complexity factors",
      employeeName: "David Wilson",
      employeeTitle: "Sales Executive",
      department: "Sales",
      branch: "Eastern Region",
      indicators: [
        {
          id: 601,
          name: "Sales Target Achievement",
          targetValue: "$200,000",
          actualValue: "$180,000",
          weight: "25%",
          self_rating: "4",
          supervisor_rating: "2",
          measurement_type: "currency",
        },
        {
          id: 602,
          name: "Client Retention Rate",
          targetValue: "85%",
          actualValue: "80%",
          weight: "15%",
          self_rating: "4",
          supervisor_rating: "3",
          measurement_type: "percentage",
        },
      ],
    },
    {
      id: 7,
      agreementTitle: "Performance Agreement 2023 Q1",
      agreementId: 7,
      period: "Quarterly Review",
      createdDate: "2023-01-01",
      submittedDate: "2023-04-05",
      reviewedDate: "2023-04-12",
      supervisorApprovedDate: "2023-04-15",
      status: "pending_hod",
      totalPartA: "90",
      totalPartB: "88",
      totalScore: "89",
      employeeName: "Michael Brown",
      employeeTitle: "Project Manager",
      department: "Operations",
      branch: "Central Region",
      indicators: [
        {
          id: 701,
          name: "Project Delivery On Time",
          targetValue: "100%",
          actualValue: "95%",
          weight: "30%",
          self_rating: "4",
          supervisor_rating: "5",
          measurement_type: "percentage",
        },
        {
          id: 702,
          name: "Budget Adherence",
          targetValue: "100%",
          actualValue: "98%",
          weight: "20%",
          self_rating: "5",
          supervisor_rating: "5",
          measurement_type: "percentage",
        },
      ],
    },
  ]);

  // Filter appraisals based on filter criteria
  const [filteredAppraisals, setFilteredAppraisals] = useState(appraisals);

  // Apply filters when filter state changes
  useEffect(() => {
    let filtered = appraisals;

    if (filterText) {
      filtered = filtered.filter((appraisal) =>
        appraisal.agreementTitle
          .toLowerCase()
          .includes(filterText.toLowerCase())
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (appraisal) => appraisal.status === filterStatus
      );
    }

    if (filterPeriod) {
      filtered = filtered.filter(
        (appraisal) => appraisal.period === filterPeriod
      );
    }

    setFilteredAppraisals(filtered);
  }, [filterText, filterStatus, filterPeriod, appraisals]);

  // Apply pagination
  const totalPages = Math.ceil(filteredAppraisals.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedAppraisals = filteredAppraisals.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  // Handler functions
  const handleConfirmSubmit = () => {
    alert("Submitting appraisal... (coming soon)");
    setIsSubmitModalOpen(false);
  };

  const handleEdit = (appraisal) => {
    alert(`Editing appraisal: ${appraisal.agreementTitle} (coming soon)`);
  };

  const handleDelete = (appraisal) => {
    alert(`Deleting appraisal: ${appraisal.agreementTitle} (coming soon)`);
  };

  const handleContinueRating = (appraisal) => {
    navigate(`/performance/rating/self/edit/${appraisal.id}`);
  };

  const handleStartRating = (appraisal) => {
    navigate(`/performance/rating/self/edit/${appraisal.id}`);
  };

  const handleSubmitRating = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsSubmitModalOpen(true);
  };

  const handleViewAssessment = (appraisal) => {
    setSelectedAppraisal(appraisal);
    setIsAssessmentModalOpen(true);
  };

  const handlePreview = (appraisal) => {
    console.log("Preview appraisal:", appraisal);
  };

  const handleReset = () => {
    setFilterText("");
    setFilterStatus("");
    setFilterPeriod("");
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleApproveAssessment = (appraisal) => {
    console.log("Accepting supervisor rating:", appraisal);
    const updatedAppraisals = appraisals.map((a) =>
      a.id === appraisal.id ? { ...a, status: "user_accepted" } : a
    );
    setAppraisals(updatedAppraisals);
    setIsAssessmentModalOpen(false);
    alert(
      "You have accepted the supervisor's rating. It will now proceed to HOD for approval."
    );
  };

  const handleRejectAssessment = (appraisal) => {
    console.log("Rejecting supervisor rating:", appraisal);
    const rejectionReason = prompt(
      "Please provide a reason for rejecting the supervisor's rating:"
    );
    if (rejectionReason) {
      const updatedAppraisals = appraisals.map((a) =>
        a.id === appraisal.id
          ? { ...a, status: "user_rejected", rejectionReason }
          : a
      );
      setAppraisals(updatedAppraisals);
      setIsAssessmentModalOpen(false);
      alert(
        "You have rejected the supervisor's rating. Your feedback will be sent to the supervisor."
      );
    }
  };

  // Get unique periods for filter dropdown
  const periods = [...new Set(appraisals.map((a) => a.period))];

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate time ago
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4 bg-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Self-Rating</h1>
          <p className="text-sm text-gray-600 mt-1">
            Rate your performance against your agreed KPIs
          </p>
        </div>
        <OverallProgress progress={75} riskStatus={false} />
      </div>

      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="Self-Rating Filters"
          filters={[
            {
              id: "filterText",
              label: "Search",
              type: "text",
              placeholder: "Search by agreement title...",
              value: filterText,
              onChange: (e) => setFilterText(e.target.value),
            },
            {
              id: "filterStatus",
              label: "Status",
              type: "select",
              value: filterStatus,
              onChange: (e) => setFilterStatus(e.target.value),
              options: [
                { value: "", label: "-- All Statuses --" },
                { value: "pending_rating", label: "Pending Rating" },
                { value: "in_progress", label: "Rating In Progress" },
                { value: "submitted", label: "Submitted to Supervisor" },
                { value: "supervisor_reviewed", label: "Supervisor Reviewed" },
                { value: "user_accepted", label: "You Accepted Rating" },
                { value: "user_rejected", label: "You Rejected Rating" },
                { value: "pending_hod", label: "Pending HOD Approval" },
              ],
            },
            {
              id: "filterPeriod",
              label: "Period",
              type: "select",
              value: filterPeriod,
              onChange: (e) => setFilterPeriod(e.target.value),
              options: [
                { value: "", label: "-- All Periods --" },
                ...periods.map((period) => ({ value: period, label: period })),
              ],
            },
          ]}
          buttons={[
            {
              label: "Reset Filters",
              variant: "secondary",
              onClick: handleReset,
            },
          ]}
        />

        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
          <AppraisalToolbar
            recordsPerPage={recordsPerPage}
            onRecordsPerPageChange={handleRecordsPerPageChange}
            totalRecords={filteredAppraisals.length}
            showCreateButton={false}
          />

          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Agreement</TableHeader>
                <TableHeader>Period</TableHeader>
                <TableHeader>Created Date</TableHeader>
                <TableHeader>Submitted Date</TableHeader>
                <TableHeader>Status</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedAppraisals.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No appraisals found. Please contact your supervisor if you
                    believe this is an error.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedAppraisals.map((appraisal) => (
                  <TableRow key={appraisal.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900">
                        {appraisal.agreementTitle}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {appraisal.indicators.length} KPIs to rate
                      </div>
                    </TableCell>
                    <TableCell>{appraisal.period}</TableCell>
                    <TableCell>
                      <div>
                        {formatDate(appraisal.createdDate)}
                        <span className="block text-xs text-gray-500 mt-1">
                          {getTimeAgo(appraisal.createdDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {appraisal.submittedDate ? (
                        <div>
                          {formatDate(appraisal.submittedDate)}
                          <span className="block text-xs text-gray-500 mt-1">
                            {getTimeAgo(appraisal.submittedDate)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">
                          Not submitted yet
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={appraisal.status} />
                    </TableCell>
                    <TableCell>
                      <AppraisalActions
                        appraisal={appraisal}
                        onStartRating={handleStartRating}
                        onSubmit={handleSubmitRating}
                        onOverallAssessment={handleViewAssessment}
                        onPreview={handlePreview}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={isSubmitModalOpen}
        closeModal={() => setIsSubmitModalOpen(false)}
        onConfirm={() => {}}
        appraisal={selectedAppraisal}
      />

      {/* Overall Assessment Modal */}
      <OverallAssessmentModal
        isOpen={isAssessmentModalOpen}
        closeModal={() => setIsAssessmentModalOpen(false)}
        appraisal={selectedAppraisal}
        onApprove={handleApproveAssessment}
        onReject={handleRejectAssessment}
      />
    </div>
  );
};

export default SelfRating;
