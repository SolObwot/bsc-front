import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/useToast";
import { userService } from '../../services/user.service';
import UserForm from './UserForm';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userService.getUser(id);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: "Failed to fetch user data",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [id, toast]);

  const handleFormSubmit = async (userData) => {
    try {
      await userService.updateUser(id, userData);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate('/admin/users');
  };

return (
    <div className="w-full p-4 mt-8">
        {user && (
            <UserForm onSubmit={handleFormSubmit} initialData={user} onCancel={handleCancel} />
        )}
    </div>
);
};

export default EditUser;
