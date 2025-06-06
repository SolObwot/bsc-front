import React from 'react';
import DeleteWeightModal from './DeleteWeightModal';

const DeleteStrategyPerspective = ({ isOpen, closeModal, onConfirm, weight }) => {
  const handleConfirm = () => {
    if (weight) {
      onConfirm(weight);
    }
  };

  // Use the DeleteWeightModal component
  return (
    <DeleteWeightModal
      isOpen={isOpen}
      closeModal={closeModal}
      onConfirm={handleConfirm}
      weight={weight}
    />
  );
};

export default DeleteStrategyPerspective;
