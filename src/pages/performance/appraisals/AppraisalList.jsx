import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../../hooks/useToast";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
  TableSkeleton,
} from "../../../components/ui/Tables";
import ObjectiveHeader from "../../../components/balancescorecard/Header";
import Button from "../../../components/ui/Button";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import StartAppraisalModal from "./StartAppraisalModal";
import {
  createAppraisal,
  fetchMyAppraisals,
  resetMyAppraisals,
} from "../../../redux/appraisalSlice";
import AppraisalStatusBadge from "./AppraisalStatusBadge";
import FilterBox from "../../../components/ui/FilterBox";
import AppraisalActions from "./AppraisalActions";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

const AppraisalList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const toastRef = useRef(toast);

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );
  const [filterText, setFilterText] = useState("");

  const {
    myAppraisals: appraisals,
    loading,
    error,
  } = useSelector((state) => state.appraisals);
  const [filteredAppraisals, setFilteredAppraisals] = useState([]);
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const loadAppraisals = async () => {
      try {
        await dispatch(fetchMyAppraisals()).unwrap();
      } catch (err) {
        toastRef.current({
          title: "Error",
          description: err || "Failed to load appraisals.",
          variant: "destructive",
        });
      }
    };

    loadAppraisals();

    return () => {
      dispatch(resetMyAppraisals());
    };
  }, [dispatch]);

  useEffect(() => {
    let filtered = appraisals;

    if (filterText) {
      const searchValue = filterText.toLowerCase();
      filtered = filtered.filter((appraisal) =>
        (appraisal.agreement?.name || "").toLowerCase().includes(searchValue)
      );
    }

    if (filterStatus) {
      filtered = filtered.filter(
        (appraisal) => appraisal.status === filterStatus
      );
    }

    if (filterYear) {
      filtered = filtered.filter((appraisal) => {
        if (!appraisal.created_at) return false;
        const appraisalYear = new Date(appraisal.created_at)
          .getFullYear()
          .toString();
        return appraisalYear === filterYear;
      });
    }

    setFilteredAppraisals(filtered);
  }, [filterStatus, filterYear, filterText, appraisals]);

  const handleStartNew = () => {
    setIsStartModalOpen(true);
  };

  const handleStartSubmit = async (appraisalData) => {
    try {
      await dispatch(createAppraisal(appraisalData)).unwrap();
      setIsStartModalOpen(false);
      toast({
        title: "Success! 🎉",
        description: "Your appraisal has been started successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to Start Appraisal",
        description:
          "Something went wrong while starting the appraisal process.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFilterStatus("");
    setFilterYear(currentYear.toString());
    setFilterText("");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatType = (typeValue, fallbackPeriod) => {
    const value = typeValue || fallbackPeriod;
    if (value === "mid_term") return "Mid-Term Review";
    if (value === "annual") return "Annual Review";
    if (value === "probation") return "Probation Review";
    return value || "—";
  };

  const handleEditAppraisal = () => {
    toast({
      title: "Edit appraisal",
      description:
        "Editing appraisals will be available soon. Please check back shortly.",
    });
  };

  const handleSubmitAppraisal = () => {
    toast({
      title: "Submit appraisal",
      description:
        "Submission workflow is not yet configured in this preview build.",
    });
  };

  const handleSelfRating = () => {
    toast({
      title: "Self rating",
      description:
        "The self-rating workflow is under construction. Please check back soon.",
    });
  };

  const handleApproveAppraisal = () => {
    toast({
      title: "Approve appraisal",
      description: "Approval actions will be available in an upcoming release.",
    });
  };

  const handleOverallAssessment = () => {
    toast({
      title: "Overall assessment",
      description:
        "Overall assessment reporting is under construction. Stay tuned!",
    });
  };

  const handlePreviewAppraisal = () => {
    toast({
      title: "Preview appraisal",
      description: "Preview experience is coming soon.",
    });
  };

  const handleDeleteAppraisal = () => {
    toast({
      title: "Delete appraisal",
      description:
        "Delete functionality will be available in a subsequent update.",
      variant: "destructive",
    });
  };

  const normalizeToken = (value) =>
    (value || "").toString().trim().toLowerCase();

  const getAppraisalActionKeys = (status, action) => {
    const normalizedStatus = normalizeToken(status);
    const normalizedAction = normalizeToken(action) || "pending"; // Default to pending if action is missing

    if (normalizedStatus === "draft") {
      const draftMatrix = {
        pending: ["edit", "selfRating", "delete"],
        "in-progress": ["edit", "selfRating"],
        in_progress: ["edit", "selfRating"],
        completed: ["edit", "selfRating", "submit"],
      };
      return draftMatrix[normalizedAction] || ["edit", "selfRating"];
    }

    if (normalizedStatus === "employee_review") {
      const employeeMatrix = {
        pending: ["overallAssessment", "preview", "approve"],
        disagree: ["overallAssessment", "preview"],
        completed: ["overallAssessment", "preview", "approve"],
      };
      return (
        employeeMatrix[normalizedAction] || ["overallAssessment", "preview"]
      );
    }

    if (
      [
        "supervisor",
        "hod",
        "branch_supervisor",
        "peer_approval",
        "branch_final_assessment",
      ].includes(normalizedStatus)
    ) {
      return ["edit", "preview", "overallAssessment"];
    }

    return ["preview"]; // Fallback for unknown statuses
  };

  const buildActionProps = (appraisal) => {
    const availableActions = getAppraisalActionKeys(
      appraisal.status,
      appraisal.action
    );

    const handlerEntries = {
      edit: { prop: "onEdit", handler: handleEditAppraisal },
      selfRating: { prop: "onSelfRating", handler: handleSelfRating },
      delete: { prop: "onDelete", handler: handleDeleteAppraisal },
      submit: { prop: "onSubmit", handler: handleSubmitAppraisal },
      overallAssessment: {
        prop: "onOverallAssessment",
        handler: handleOverallAssessment,
      },
      preview: { prop: "onPreview", handler: handlePreviewAppraisal },
      approve: { prop: "onApprove", handler: handleApproveAppraisal },
    };

    return availableActions.reduce((accumulator, actionKey) => {
      const entry = handlerEntries[actionKey];
      if (entry) {
        accumulator[entry.prop] = entry.handler;
      }
      return accumulator;
    }, {});
  };

  return (
    <div className="min-h-screen bg-white shadow-md rounded-lg">
      <ObjectiveHeader />
      <div className="flex justify-between p-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">My Appraisals</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and complete your performance appraisals.
          </p>
        </div>
      </div>

      <div className="px-4 py-2 bg-white">
        <FilterBox
          title="My Appraisals Filters"
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
                { value: "draft", label: "Draft" },
                { value: "submitted", label: "Submitted" },
                {
                  value: "supervisor_reviewed",
                  label: "Supervisor Reviewed",
                },
                { value: "peer_reviewed", label: "Peer Reviewed" },
                { value: "branch_reviewed", label: "Branch Reviewed" },
                { value: "hod_reviewed", label: "HOD Reviewed" },
                { value: "completed", label: "Completed" },
                { value: "rejected", label: "Rejected" },
              ],
            },
            {
              id: "filterYear",
              label: "Year",
              type: "select",
              value: filterYear,
              onChange: (e) => setFilterYear(e.target.value),
              options: [
                { value: "", label: "-- All Years --" },
                ...Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                  (year) => ({
                    value: year.toString(),
                    label: year.toString(),
                  })
                ),
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
          <div className="flex flex-col sm:flex-row justify-between items-end mb-4">
            <Button
              type="button"
              variant="pride"
              className="flex items-center gap-2 mb-4 sm:mb-0"
              onClick={handleStartNew}
            >
              <DocumentPlusIcon className="h-5 w-5" aria-hidden="true" />
              Start Appraisal
            </Button>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">
                {filteredAppraisals.length > 0
                  ? `(${filteredAppraisals.length}) Records Found`
                  : "No Records Found"}
              </span>
            </div>
          </div>

          <div>
            {loading && appraisals.length === 0 ? (
              <TableSkeleton rows={5} columns={5} />
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Agreement Name</TableHeader>
                    <TableHeader>Appraisal Type</TableHeader>
                    <TableHeader>Supervisor</TableHeader>
                    <TableHeader>HOD/Line Manager</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Started</TableHeader>
                    <TableHeader>Submitted</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppraisals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No appraisals found. Click "Start New Appraisal" to
                        begin.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAppraisals.map((appraisal) => (
                      <TableRow key={appraisal.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="text-sm font-medium text-gray-900">
                            {appraisal.agreement?.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">
                            {formatType(appraisal.type, appraisal.period)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {appraisal.supervisor
                            ? `${appraisal.supervisor.surname} ${appraisal.supervisor.first_name}`
                            : "Not assigned"}
                        </TableCell>
                        <TableCell>
                          {appraisal.hod
                            ? `${appraisal.hod.surname} ${appraisal.hod.first_name}`
                            : "Not assigned"}
                        </TableCell>
                        <TableCell>
                          <AppraisalStatusBadge
                            status={appraisal.status}
                            action={appraisal.action}
                          />
                        </TableCell>
                        <TableCell>
                          <div>{formatDate(appraisal.created_at)}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(appraisal.created_at) || "—"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {appraisal.submitted_at ? (
                            <>
                              <div>{formatDate(appraisal.submitted_at)}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {formatTimeAgo(appraisal.submitted_at)}
                              </div>
                            </>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Not submitted yet
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <AppraisalActions
                            appraisal={appraisal}
                            {...buildActionProps(appraisal)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <StartAppraisalModal
        isOpen={isStartModalOpen}
        closeModal={() => setIsStartModalOpen(false)}
        onSubmit={handleStartSubmit}
      />
    </div>
  );
};

export default AppraisalList;
