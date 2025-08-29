import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import JobOrScaleForm from "./JobOrScaleForm";
import { XMarkIcon } from "@heroicons/react/24/outline";

const JobOrScaleModal = ({ isOpen, closeModal, onSubmit, initialData, isEditing }) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-teal-100">
              <div className="bg-teal-50 px-6 py-5 border-b border-teal-100 flex items-center justify-between">
                <Dialog.Title className="text-lg font-semibold text-gray-700">
                  {isEditing ? "Edit Grade/Scale" : "Add Grade/Scale"}
                </Dialog.Title>
                <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="px-7 pt-7 pb-4">
                <JobOrScaleForm
                  onSubmit={onSubmit}
                  initialData={initialData}
                  onCancel={closeModal}
                  isModal={true}
                  isEditing={isEditing}
                />
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default JobOrScaleModal;
