import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/useToast";
import { userService } from '../../services/user.service';
import UserForm from './UserForm';

const AddUser = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFormSubmit = async (userData) => {
    try {
      await userService.createUser(userData);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      navigate('/admin/users');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

  return (
    <div className="w-full p-4 mt-8">
      <UserForm onSubmit={handleFormSubmit} onCancel={handleCancel}/>
    </div>
  );
};

export default AddUser;
