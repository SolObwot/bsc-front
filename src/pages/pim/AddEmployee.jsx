import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../hooks/useToast";
import Tabs from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/avatar';
import EmployeeForm from './EmployeeForm';

const AddEmployee = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [employee, setEmployee] = useState(null);

    const handleSubmit = async (formData) => {
        try {
            await userService.createUser(formData);
            toast({
              title: "Success",
              description: "Employee added successfully",
            });
            navigate('/pim/employees');
        } catch (error) {
            // Handle error
            toast({
              title: "Error",
              description: "Failed to add employee",
              variant: "destructive",
            });
        }
    };

    const tabs = {
        personalDetails: {
            label: "Personal Details",
            content: () => {
                return (
                    <div className="p-8">
                        <h2 className="text-xl font-medium text-gray-700 mb-4">Personal Details</h2>
                        <EmployeeForm 
                            section="personalDetails"
                            initialData={null}
                            onSubmit={handleSubmit}
                        />
                    </div>
                );
            }
        },
        contactDetails: {
            label: "Contact Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Contact Details</h2>
                    <EmployeeForm 
                        section="contactDetails"
                        initialData={employee}
                        onSubmit={handleSubmit}
                    />
                </div>
            )
        },
        emergencyContacts: {
            label: "Emergency Contacts",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Emergency Contacts</h2>
                    {/* Emergency contacts content here */}
                </div>
            )
        },
        // Add more tabs as needed...
    };

    const renderContent = (tabKey) => {
        return tabs[tabKey]?.content();
    };

    const profileHeader = (
        <div className="space-y-4 text-center p-4 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-700">Add New Employee</h2>
            <Avatar 
                className="w-26 h-26 mx-auto"
                src="/src/assets/profile.png"
            />
        </div>
    );

    return (
        <div className="container mx-auto px-4">
            <Tabs 
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                renderContent={renderContent}
                sidebarHeader={profileHeader}
            />
        </div>
    );
};

export default AddEmployee;