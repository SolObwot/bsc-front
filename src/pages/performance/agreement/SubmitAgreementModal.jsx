import React from 'react';
import Modal from '../../../components/ui/Modal';
import { UserCircleIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/20/solid';
import { useDispatch } from 'react-redux';
import { submitAgreement } from '../../../redux/agreementSlice';
import { useToast } from '../../../hooks/useToast';

const SubmitAgreementModal = ({ isOpen, closeModal, agreement, onSubmit }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  if (!agreement) return null;

   const handleSubmit = async () => {
      try {
        await dispatch(submitAgreement(agreement.id)).unwrap();
        
        closeModal();
        toast({
          title: "Success",
          description: "Agreement submitted for review successfully!",
        });
        
        if (onSubmit) {
          onSubmit();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to submit agreement. Please try again.",
          variant: "destructive",
        });
      }
    };

  // Format employee name from API data structure
  const employeeName = agreement.creator ? 
    `${agreement.creator.surname} ${agreement.creator.last_name}` : 
    agreement.employeeName || 'Employee';
    
  // Get employee title if available
  const employeeTitle = agreement.employeeTitle || '';
  
  // Format period for display
  const periodDisplay = agreement.period === 'annual' ? 
    'Annual Review' : 
    agreement.period === 'probation' ? 
      'Probation 6 months' : 
      agreement.period;
  
  // Format supervisor and HOD names
  const supervisorName = agreement.supervisor ? 
    `${agreement.supervisor.surname} ${agreement.supervisor.last_name}` : 
    agreement.supervisorName || 'Supervisor';
    
  const hodName = agreement.hod ? 
    `${agreement.hod.surname} ${agreement.hod.last_name}` : 
    agreement.hodName || 'HOD';

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      title="Submit Performance Agreement"
      footer={
        <>
          <button
            onClick={closeModal}
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="inline-flex justify-center rounded-md border border-transparent bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
          >
            Submit Agreement
          </button>
        </>
      }
    >
        {/* Agreement Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-lg text-gray-800 mb-2">{agreement.title || agreement.name}</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
            <UserCircleIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>{employeeName}{employeeTitle ? ` - ${employeeTitle}` : ''}</span>
            </div>
            <div className="flex items-center text-gray-600">
            <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Period: {periodDisplay}</span>
            </div>
            <div className="flex items-center text-gray-600">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-500" />
            <span>Date: {new Date().toLocaleDateString()}</span>
            </div>
            {agreement.status && (
            <div className="flex items-center text-gray-600">
              <span className="font-medium mr-1">Status:</span>
              <span className="capitalize bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md text-xs">
                {agreement.status.replace('_', ' ')}
              </span>
            </div>
            )}
          </div>
          <p className="text-amber-600 text-sm mt-3">
            Once submitted, you can't edit or add performance measures to this agreement
          </p>
        </div>

        {/* Employee Statement */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-800 mb-2">Statement of the Employee</h3>
        <p className="text-sm text-gray-600 mb-4">
          I <span className="font-medium">{employeeName}</span> accept the performance accountabilities 
          of this agreement and agree to produce the results, perform the work and meet the standards set forth in this agreement.  
          I do understand and accept that my performance for the period <span className="font-medium">{periodDisplay}</span> will be measured against this agreement.
        </p>
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Employee:</span>
            <span className="text-sm font-medium">{employeeName}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-sm text-gray-500">Action:</span>
            <span className="text-sm font-medium text-amber-600">Submitting Agreement</span>
          </div>
        </div>
      </div>

      {/* Distribution note */}
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
        <p className="font-medium mb-1">Upon submission, the following will be notified:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>You (Employee)</li>
          <li>Your Immediate Supervisor: <span className="font-medium">{supervisorName}</span></li>
          <li>HOD/Line Manager: <span className="font-medium">{hodName}</span></li>
        </ul>
        <p className="text-amber-600 text-sm mt-3">
            Once submitted, this agreement can't be edited or modified to add/change performance measures.
        </p>
      </div>
    </Modal>
  );
};

export default SubmitAgreementModal;