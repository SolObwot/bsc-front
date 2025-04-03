import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createJobTitle } from "../../../redux/jobTitleSlice";
import JobTitleForm from "./JobTitleForm";
import { useToast, ToastContainer } from "../../../hooks/useToast";

const AddJobTitle = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { loading } = useSelector((state) => state.jobTitles);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(createJobTitle(formData));
    if (createJobTitle.fulfilled.match(resultAction)) {
      toast({
        title: "Success",
        description: "Job Title added successfully.",
        variant: "success",
      });
      navigate("/admin/job/jobtitle");
    } else {
      toast({
        title: "Error",
        description: "Failed to add Job Title. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <JobTitleForm
        section="Add Job Title"
        onSubmit={handleSubmit}
        onCancel={() => navigate("/admin/job/jobtitle")}
        isLoading={loading}
      />
    </div>
  );
};

export default AddJobTitle;
