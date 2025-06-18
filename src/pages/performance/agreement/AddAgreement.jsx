import React from 'react';
import CreateAgreementModal from './CreateAgreementModal';

const AddAgreement = ({ isOpen, closeModal, onSubmit }) => {
  const handleSubmit = (formData) => {
    const newAgreement = {
      name: formData.name,
      period: formData.period
    };
    
    onSubmit(newAgreement);
  };

  return (
    <CreateAgreementModal
      isOpen={isOpen}
      closeModal={closeModal}
      onSubmit={handleSubmit}
    />
  );
};

export default AddAgreement;