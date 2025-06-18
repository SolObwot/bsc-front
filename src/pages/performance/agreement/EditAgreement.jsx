import React from 'react';
import CreateAgreementModal from './CreateAgreementModal';

const EditAgreement = ({ isOpen, closeModal, onSubmit, agreement }) => {
  const handleSubmit = (formData) => {
    const updatedAgreement = {
      ...agreement,
      name: formData.name,
      period: formData.period,
      supervisorName: formData.supervisorName,
      hodName: formData.hodName,
      supervisor_id: formData.supervisor_id,
      hod_id: formData.hod_id
    };
    
    onSubmit(updatedAgreement);
  };

  return (
    <CreateAgreementModal
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={handleSubmit}
      initialData={agreement}
    />
  );
};

export default EditAgreement;