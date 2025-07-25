import React, { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import StatusBadge from './AgreementStatusBadge'; 
import { UserCircleIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/20/solid';
import { useToast } from '../../../hooks/useToast';

const AgreementApprovalModal = ({ isOpen, closeModal, agreement, onApprove, onReject }) => {
  const [supervisorApproved, setSupervisorApproved] = useState(false);
  const [hodApproved, setHodApproved] = useState(false);
  const [comments, setComments] = useState('');
  const { toast } = useToast();


  useEffect(() => {
    if (agreement) {
      setSupervisorApproved(agreement.status === 'pending_hod' || agreement.status === 'approved');
      setHodApproved(agreement.status === 'approved');
    }
    // Reset comments when modal opens with a new agreement
    setComments('');
  }, [agreement]);


  
  const handleSupervisorApprove = () => {
    if (comments.trim() === '') {
      toast({
        title: "Error",
        description: "Please provide comments before approving the agreement.",
        variant: "destructive",
      });
      return;
    }
    onApprove({
      action: 'approve',
      comment: comments
    });
  };
  
  const handleHodApprove = () => {
    if (comments.trim() === '') {
      toast({
        title: "Error",
        description: "Please provide comments before approving the agreement.",
        variant: "destructive",
      });
      return;
    }
    onApprove({
      action: 'approve',
      comment: comments
    });
  };
  
  const handleReject = () => {
    if (comments.trim() === '') {
      toast({
        title: "Error",
        description: "Please provide comments explaining why you are rejecting this agreement.",
        variant: "destructive",
      });
      return;
    }
    onReject({
      action: 'reject',
      comment: comments,
      rejection_reason: comments
    });
  };

  if (!agreement) return null;

// Extract employee name from creator object
  const employeeName = agreement.creator ? 
    `${agreement.creator.surname} ${agreement.creator.last_name}${agreement.creator.other_name ? ' ' + agreement.creator.other_name : ''}` : 
    'Unknown';
  
  // Extract job title
  const employeeTitle = agreement.creator?.job_title?.name || 'N/A';
  
  // Format period for display
  const periodDisplay = agreement.period === 'annual' ? 'Annual Review' : 
                        agreement.period === 'probation' ? 'Probation 6 months' : 
                        agreement.period;
  
  // Get supervisor and HOD names (these might need to be adjusted based on your data structure)
  const supervisorName = agreement.supervisor ? `${agreement.supervisor.surname} ${agreement.supervisor.last_name}${agreement.supervisor.other_name ? ' ' + agreement.supervisor.other_name : ''}` : 'Not Assigned';
  const hodName = agreement.hod ? `${agreement.hod.surname} ${agreement.hod.last_name}${agreement.hod.other_name ? ' ' + agreement.hod.other_name : ''}` : 'Not Assigned';

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
          onClick={handleReject}
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
      {isApproved && (
        <button
          onClick={() => onApprove({
            action: 'approve',
            comment: comments
          })} 
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
        <h3 className="font-medium text-lg text-gray-800 mb-2">{agreement.name}</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center text-gray-600">
            <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{employeeName}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Period: {periodDisplay}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Submitted: {agreement.submitted_at ? new Date(agreement.submitted_at).toLocaleDateString() : 'Not submitted'}</span>
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
          <span className="font-medium">{employeeName}</span> has accepted the performance accountabilities of this agreement and agreed to produce the results, perform the work and meet the standards set forth in this agreement. 
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
                <span className="text-sm font-medium">{employeeName}</span>
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
                <span className="text-sm font-medium">{supervisorName}</span>
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
            <span className="text-sm font-medium">{hodName}</span>
          </div>
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-500">Status:</span>
            <span className={`text-sm font-medium ${hodApproved || agreement?.status === 'approved' ? 'text-green-600' : 'text-amber-600'}`}>
              {hodApproved || agreement?.status === 'approved' ? 'Approved' : 'Pending HOD Approval'}
            </span>
          </div>
        </div>
      </div>

      {/* Comments Section - Added similar to HODApprovalModal */}
      <div className="mb-6">
        <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-1">
          {agreement?.status === 'pending_supervisor' ? 'Supervisor Comments' : 'HOD Comments'} <span className="text-red-500">*</span>
        </label> 
        <textarea
          id="comments"
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm resize-none p-2 border"
          placeholder={`Enter your comments or feedback about this agreement as ${agreement?.status === 'pending_supervisor' ? 'a Supervisor' : 'Head of Department'}...`}
          value={comments}
          onChange={(e) => setComments(e.target.value)}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Notifications will be sent to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Employee: <span className="font-medium">{employeeName}</span></li>
          <li>Immediate Supervisor: <span className="font-medium">{supervisorName}</span></li>
          <li>Head of Department/Line Manager: <span className="font-medium">{hodName}</span></li>
        </ul>
      </div>
    </Modal>
  );
};

export default AgreementApprovalModal;