import React from 'react';
import CreateAgreementModal from './CreateAgreementModal';

const EditAgreement = ({ isOpen, closeModal, onSubmit, agreement }) => {
  const handleSubmit = (formData) => {
    const periodDisplay = formData.period === 'annual' 
      ? 'Annual Review' 
      : 'Probation 6 months';
      
    const updatedAgreement = {
      ...agreement,
      title: formData.name,
      name: formData.name,
      period: periodDisplay,
      supervisorName: formData.supervisorName,
      hodName: formData.hodName
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