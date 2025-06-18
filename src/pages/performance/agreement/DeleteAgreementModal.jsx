import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const DeleteAgreementModal = ({ isOpen, closeModal, onConfirm, agreement }) => {
  if (!agreement) return null;

  // Use consistent property access as in AgreementList
  const agreementName = agreement.name || agreement.title || 'Unknown';
  
  const supervisorName = agreement.supervisor ? 
    `${agreement.supervisor.surname} ${agreement.supervisor.last_name}` : 
    agreement.supervisorName || 'Not assigned';
  
  const hodName = agreement.hod ? 
    `${agreement.hod.surname} ${agreement.hod.last_name}` : 
    agreement.hodName || 'Not assigned';
  
  const periodDisplay = agreement.period === 'annual' ? 'Annual Review' : 
    agreement.period === 'probation' ? 'Probation 6 months' : 
    agreement.period;
  
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-xl transition-all border border-red-100">
                <div className="bg-red-50 px-6 py-5 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                      Delete Performance Agreement
                    </Dialog.Title>
                    <button onClick={closeModal} className="hover:bg-red-100 rounded-full p-2">
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Are you sure you want to delete this performance agreement?
                    </p>
                    <p className="text-red-600 text-sm">
                      This action cannot be undone. All associated KPIs and objectives will be permanently removed.
                    </p>
                    
                    <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-600">
                      <p className="font-medium">Agreement Details:</p>
                      <p>Name: {agreementName || 'Unknown'}</p>
                      <p>Period: {periodDisplay || 'Unknown'}</p>
                      <p>Supervisor: {supervisorName || 'Not assigned'}</p>
                      <p>HOD/Line Manager: {hodName || 'Not assigned'}</p>
                      <p>Status: {agreement?.status || 'Unknown'}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={closeModal}
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onConfirm(agreement.id);
                        closeModal();
                      }}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Delete Agreement
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteAgreementModal;