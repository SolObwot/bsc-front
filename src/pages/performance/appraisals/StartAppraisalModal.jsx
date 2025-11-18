import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import AppraisalForm from "./AppraisalForm";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllAgreements } from "../../../redux/agreementSlice";

const StartAppraisalModal = ({
  isOpen,
  closeModal,
  onSubmit,
  isEditing = false,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { departmentAgreements: agreements, loading: agreementsLoading } =
    useSelector((state) => state.agreements);
  const [agreementsFetched, setAgreementsFetched] = useState(false);

  useEffect(() => {
    if (isOpen && !agreementsFetched) {
      const currentYear = new Date().getFullYear();
      dispatch(
        fetchAllAgreements({
          status: "approved",
          year: currentYear,
          my_agreements: true,
        })
      );
      setAgreementsFetched(true);
    }
  }, [isOpen, agreementsFetched, dispatch]);

  const handleClose = () => {
    closeModal();
    setAgreementsFetched(false);
  };

  const handleFormSubmit = async (formData) => {
    await onSubmit(formData);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-800 capitalize">
                      {isEditing
                        ? "Edit Appraisal"
                        : "Start New Performance Appraisal"}
                    </Dialog.Title>
                    <button
                      onClick={handleClose}
                      className="hover:bg-teal-100 rounded-full p-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  {!isEditing && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md border border-blue-100 flex items-start">
                      <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        Select an approved performance agreement from the list
                        to start your appraisal. Your supervisor and HOD/line
                        manager who approved the agreement will be automatically
                        added to the appraisal process. You can edit this later
                        if it's not correct.
                      </p>
                    </div>
                  )}
                  {agreementsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <ArrowPathIcon className="h-6 w-6 animate-spin text-teal-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        Loading agreements...
                      </span>
                    </div>
                  ) : agreements.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          No agreements found for your query. Check the status
                          of your agreement.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setAgreementsFetched(false);
                          // Trigger refetch
                          const currentYear = new Date().getFullYear();
                          dispatch(
                            fetchAllAgreements({
                              status: "approved",
                              year: currentYear,
                              my_agreements: true,
                            })
                          );
                          setAgreementsFetched(true);
                        }}
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Retry
                      </button>
                    </div>
                  ) : (
                    <AppraisalForm
                      initialData={initialData}
                      onSubmit={handleFormSubmit}
                      onCancel={handleClose}
                      agreements={agreements}
                      isModal={true}
                      isEditing={isEditing}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default StartAppraisalModal;
