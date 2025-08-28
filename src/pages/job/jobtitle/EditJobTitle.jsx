import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobTitle, updateJobTitle } from "../../../redux/jobTitleSlice";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import JobTitleModal from "./JobTitleModal";

const EditJobTitle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentJobTitle, loading } = useSelector((state) => state.jobTitles);

  const [isModalOpen, setIsModalOpen] = useState(true);

  useEffect(() => {
    dispatch(fetchJobTitle(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(updateJobTitle({ id, formData })).unwrap();
      toast({
        title: "Success",
        description: "Job Title updated successfully!",
        variant: "success",
      });
      setIsModalOpen(false);
      navigate("/admin/job/jobtitle");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update Job Title. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/admin/job/jobtitle");
  };

  if (loading && !currentJobTitle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      {currentJobTitle && (
        <JobTitleModal
          isOpen={isModalOpen}
          closeModal={handleCloseModal}
          onSubmit={handleSubmit}
          initialData={currentJobTitle}
        />
      )}
    </div>
  );
};

export default EditJobTitle;
