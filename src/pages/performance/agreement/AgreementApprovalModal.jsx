import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import StatusBadge from './AgreementStatusBadge'; // Updated import path
import { UserCircleIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/20/solid';

const AgreementApprovalModal = ({ isOpen, closeModal, agreement, onApprove, onReject }) => {
  const [supervisorApproved, setSupervisorApproved] = useState(false);
  const [hodApproved, setHodApproved] = useState(false);

  useEffect(() => {
    if (agreement) {
      setSupervisorApproved(agreement.status === 'pending_hod' || agreement.status === 'approved');
      setHodApproved(agreement.status === 'approved');
    }
  }, [agreement]);
  
  const handleSupervisorApprove = () => {
    onApprove('pending_hod');
  };
  
  const handleHodApprove = () => {
    onApprove('approved');
  };

  if (!agreement) return null;

  const isSupervisorActionable = agreement.status === 'pending_supervisor';
  const isHodActionable = agreement.status === 'pending_hod';
  const isApproved = agreement.status === 'approved';

  const footerButtons = (
    <>
      <button
        onClick={closeModal}
        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Close
      </button>
      {(isSupervisorActionable || isHodActionable) && (
        <button
          onClick={() => onReject && onReject(agreement.status === 'pending_supervisor' ? 'rejected_by_supervisor' : 'rejected_by_hod')}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Reject
        </button>
      )}
      {isSupervisorActionable && (
        <button
          onClick={handleSupervisorApprove}
          className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Approve as Supervisor
        </button>
      )}
      {isHodActionable && (
        <button
          onClick={handleHodApprove}
          className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          Approve as HOD
        </button>
      )}
      {isApproved && ( // Finalize button if agreement is approved but perhaps needs a final explicit step
         <button
            onClick={() => onApprove('approved')} 
            className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Finalize Agreement
          </button>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Performance Agreement Approval"
      footer={footerButtons}
    >
      {/* Agreement details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-lg text-gray-800 mb-2">{agreement?.title}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{agreement?.employeeName} - {agreement?.employeeTitle}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Period: {agreement?.period}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Submitted: {new Date(agreement?.submittedDate).toLocaleDateString()}</span>
          </div>
          <div>
            <StatusBadge status={agreement?.status} />
          </div>
        </div>
      </div>
      
      {/* Employee Statement & Approval Status */}
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-2">Statement of the Employee | Approval Status</h3>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">{agreement?.employeeName}</span> has accepted the performance accountabilities of this agreement and agreed to produce the results, perform the work and meet the standards set forth in this agreement. 
            {agreement?.status === 'pending_supervisor' && (
          <span> This agreement requires your approval as the Immediate Supervisor.</span>
            )}
            {agreement?.status === 'pending_hod' && (
          <span> This agreement requires your approval as Head of Department or Line Manager.</span>
            )}
            {agreement?.status === 'approved' && (
          <span> This agreement has been fully approved.</span>
            )}
            {(agreement?.status === 'draft' || agreement?.status === 'submitted') && (
          <span> This agreement is pending review and approval.</span>
            )}
          </p>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Employee:</span>
                  <span className="text-sm font-medium">{agreement?.employeeName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm font-medium text-green-600`}>
                    Agreement Submitted
                  </span>
                </div>
              </div>

              <div className="space-y-3 border-l border-gray-200 pl-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Supervisor:</span>
                  <span className="text-sm font-medium">{agreement?.supervisorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`text-sm font-medium ${supervisorApproved || agreement?.status === 'pending_hod' || agreement?.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
                    {supervisorApproved || agreement?.status === 'pending_hod' || agreement?.status === 'approved' ? 'Approved' : 'Pending Supervisor Approval'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-500">Head of Department:</span>
              <span className="text-sm font-medium">{agreement?.hodName}</span>
            </div>
            <div className="flex justify-between mb-3">
              <span className="text-sm text-gray-500">Status:</span>
              <span className={`text-sm font-medium ${hodApproved || agreement?.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
                {hodApproved || agreement?.status === 'approved' ? 'Approved' : 'Pending HOD Approval'}
              </span>
            </div>
          </div>
        </div>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Notifications were sent to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Employee: <span className="font-medium">{agreement?.employeeName}</span></li>
          <li>Immediate Supervisor: <span className="font-medium">{agreement?.supervisorName}</span></li>
          <li>Head of Department: <span className="font-medium">{agreement?.hodName}</span></li>
        </ul>
      </div>
    </Modal>
  );
};

export default AgreementApprovalModal;
