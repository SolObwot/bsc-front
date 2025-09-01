import React from "react";
import Modal from "../../../components/ui/Modal";
import EmploymentStatusForm from "./EmploymentStatusForm";

const EmploymentStatusModal = ({ isOpen, closeModal, onSubmit, initialData, isEditing }) => (
  <Modal isOpen={isOpen} onClose={closeModal} title={isEditing ? "Edit Employment Status" : "Add Employment Status"}>
    <EmploymentStatusForm
      isModal
      isEditing={isEditing}
      initialData={initialData}
      onSubmit={onSubmit}
      onCancel={closeModal}
    />
  </Modal>
);

export default EmploymentStatusModal;
