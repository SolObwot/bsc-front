import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service';
import Tabs from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/avatar';
import EmployeeForm from './EmployeeForm';

const EmployeeProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await userService.getUser(id);
                setEmployee(response.data);
            } catch (error) {
                console.error('Error fetching employee:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            await userService.updateUser(id, formData);
            // Handle success (maybe show a toast)
        } catch (error) {
            console.error('Error updating employee:', error);
            // Handle error
        }
    };

    const tabs = {
        personalDetails: {
            label: "Personal Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Personal Details</h2>
                    <EmployeeForm 
                        section="personalDetails"
                        initialData={employee}
                        onSubmit={handleSubmit}
                    />
                </div>
            )
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="text-gray-500">Loading employee profile...</p>
                </div>
            </div>
        );
    }

    const profileHeader = (
        <div className="space-y-4 text-center p-4 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-700">
                {employee ? `${employee.first_name} ${employee.last_name}` : 'Employee'}
            </h2>
            <Avatar 
                className="w-26 h-26 mx-auto"
                src="/src/assets/profile.png"
            />
        </div>
    );

    return (
        <Tabs 
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            renderContent={renderContent}
            sidebarHeader={profileHeader}
        />
    );
};

export default EmployeeProfile;
