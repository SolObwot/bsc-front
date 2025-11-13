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

const AppraisalList = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const toastRef = useRef(toast);

  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterYear, setFilterYear] = useState(
    new Date().getFullYear().toString()
  );

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
  }, [filterStatus, filterYear, appraisals]);

  const handleStartNew = () => {
    setIsStartModalOpen(true);
  };

  const handleStartSubmit = async (appraisalData) => {
    try {
      await dispatch(createAppraisal(appraisalData)).unwrap();
      setIsStartModalOpen(false);
      toast({
        title: "Success",
        description: "Appraisal started successfully!",
      });
      // No need to re-dispatch fetchMyAppraisals here if the slice handles the update
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to start appraisal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setFilterStatus("");
    setFilterYear(currentYear.toString());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatType = (type) => {
    if (type === "mid_term") return "Mid-Term Review";
    if (type === "annual") return "Annual Review";
    if (type === "probation") return "Probation Review";
    return type;
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
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Started</TableHeader>
                    <TableHeader>Actions</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppraisals.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
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
                          {appraisal.agreement?.name || "N/A"}
                        </TableCell>
                        <TableCell>{formatType(appraisal.period)}</TableCell>
                        <TableCell>
                          <AppraisalStatusBadge status={appraisal.status} />
                        </TableCell>
                        <TableCell>
                          {formatDate(appraisal.created_at)}
                        </TableCell>
                        <TableCell>
                          {/* Actions will be added here */}
                          <Button variant="outline" size="sm">
                            View
                          </Button>
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
