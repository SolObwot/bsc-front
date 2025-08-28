import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createJobTitle } from "../../../redux/jobTitleSlice";
import { useToast, ToastContainer } from "../../../hooks/useToast";
import JobTitleModal from "./JobTitleModal";

const AddJobTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.jobTitles);

  const [isModalOpen, setIsModalOpen] = useState(true);

  const handleSubmit = async (formData) => {
    try {
      await dispatch(createJobTitle(formData)).unwrap();
      toast({
        title: "Success",
        description: "Job Title added successfully.",
        variant: "success",
      });
      setIsModalOpen(false);
      navigate("/admin/job/jobtitle");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add Job Title. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    navigate("/admin/job/jobtitle");
  };

  return (
    <div>
      <ToastContainer />
      <JobTitleModal
        isOpen={isModalOpen}
        closeModal={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={null}
      />
    </div>
  );
};

export default AddJobTitle;
