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
      await userService.addUser(userData);
      toast({
        title: "Success",
        description: "User added successfully",
      });
      navigate('/users');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <UserForm onSubmit={handleFormSubmit} />
    </div>
  );
};

export default AddUser;
