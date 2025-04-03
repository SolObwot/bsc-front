import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobTitle, updateJobTitle } from "../../../redux/jobTitleSlice";
import { useToastNavigation } from "../../../hooks/useToastNavigation";
import JobTitleForm from "./JobTitleForm";

const EditJobTitle = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { toastAndNavigate } = useToastNavigation();
  const { currentJobTitle, loading } = useSelector((state) => state.jobTitles);

  useEffect(() => {
    dispatch(fetchJobTitle(id));
  }, [id, dispatch]);

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateJobTitle({ id, formData }));
    if (updateJobTitle.fulfilled.match(resultAction)) {
      toastAndNavigate(
        { title: "Success", description: "Job Title updated!", variant: "success" },
        "/admin/job/jobtitle"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!currentJobTitle) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Job Title data not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 mt-8">
      <JobTitleForm
        section="Edit Job Title"
        initialData={currentJobTitle}
        onSubmit={handleSubmit}
        onCancel={() =>
          toastAndNavigate(
            { title: "Info", description: "Changes discarded", variant: "default" },
            "/admin/job/jobtitle"
          )
        }
      />
    </div>
  );
};

export default EditJobTitle;
