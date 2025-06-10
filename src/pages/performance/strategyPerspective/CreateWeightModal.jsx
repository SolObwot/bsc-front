import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import StrategyPerspectiveForm from './StrategyPerspectiveForm';

const CreateWeightModal = ({ 
  isOpen, 
  closeModal, 
  onSubmit, 
  departments, 
  perspectives, 
  initialData = null
}) => {
 
  return (
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all">
                <div className="bg-teal-50 px-6 py-5 border-b border-teal-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-800 capitalize">
                      {initialData ? "Edit Perspective Weight" : "Assign Strategy Perspective"}
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-teal-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <StrategyPerspectiveForm
                    departments={departments}
                    perspectives={perspectives}
                    initialData={initialData}
                    onSubmit={onSubmit} 
                    onCancel={closeModal}
                    isModal={true}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateWeightModal;