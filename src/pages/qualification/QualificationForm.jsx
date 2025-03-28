import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const QualificationForm = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    navigate(`/admin/qualification/${type}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Add {type}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Short Code</label>
          <input type="text" className="input" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Name</label>
          <input type="text" className="input" required />
        </div>
        <div className="flex space-x-2">
          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/qualification/${type}`)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default QualificationForm;
