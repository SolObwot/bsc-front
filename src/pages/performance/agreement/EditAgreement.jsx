import React from 'react';
import CreateAgreementModal from './CreateAgreementModal';

const EditAgreement = ({ isOpen, closeModal, onSubmit, agreement }) => {
   const handleSubmit = (formData) => {
    const updatedAgreement = {
      ...agreement, // Keep existing data
      name: formData.name,
      period: formData.period,
      supervisor_id: formData.supervisor?.id || formData.supervisor_id,
      hod_id: formData.hod?.id || formData.hod_id,
      supervisor: formData.supervisor || agreement.supervisor,
      hod: formData.hod || agreement.hod
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