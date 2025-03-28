import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { userService } from '../../services/user.service';
import { employeeService } from '../../services/employee.service';
import Tabs from '../../components/ui/Tabs';
import SensitiveData from '../../components/ui/SensitiveData';
import { Avatar } from '../../components/ui/avatar';
import EmployeeForm from './EmployeeForm';
import Button from '../../components/ui/Button';

const UpdateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || "personalDetails";
    
    const [activeTab, setActiveTab] = useState(initialTab);
    const [employeeBasic, setEmployeeBasic] = useState(null);
    const [employeeContacts, setEmployeeContacts] = useState([]);
    const [mergedEmployeeData, setMergedEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch data whenever the ID changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch basic user data
                const basicResponse = await userService.getUser(id);
                setEmployeeBasic(basicResponse.data);
                
                // Fetch contact details
                const contactsResponse = await employeeService.getEmployeeContacts(id);
                const contactsData = contactsResponse.data || [];
                setEmployeeContacts(contactsData);
                
                // Merge the data properly
                const primaryContact = contactsData.length > 0 ? contactsData[0] : {};
                
                setMergedEmployeeData({
                    ...basicResponse.data,
                    contactDetails: primaryContact,
                    emergencyContacts: contactsData.filter(contact => contact.emergency_contact_name)
                });
            } catch (error) {
                console.error('Error fetching employee data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleSubmit = async (formData) => {
        try {
            // Update based on which section is being submitted
            if (activeTab === 'personalDetails') {
                await userService.updateUser(id, formData);
            } else if (activeTab === 'contactDetails') {
                await employeeService.updateContact(id, formData);
            } else if (activeTab === 'emergencyContacts') {
                await employeeService.updateContact(id, formData);
            }
            
            // Navigate back to profile page after successful update
            console.log('Update Data submitted:', formData);
            navigate(`/pim/employees/profile/${id}`);
            
        } catch (error) {
            console.error('Error updating employee:', error);
            // Add error notification here if needed
        }
    };

    const handleCancel = () => {
        navigate(`/pim/employees/profile/${id}`);
    };

    const tabs = {
        personalDetails: {
            label: "Personal Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Update Personal Details</h2>
                    {loading ? (
                        <div>Loading employee data...</div>
                    ) : (
                        <>
                            <EmployeeForm 
                                section="personalDetails"
                                initialData={mergedEmployeeData}
                                onSubmit={handleSubmit}
                            />
                            <div className="mt-4 space-x-4">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )
        },
        contactDetails: {
            label: "Contact Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Update Contact Details</h2>
                    {loading ? (
                        <div>Loading employee data...</div>
                    ) : (
                        <>
                            <EmployeeForm
                                section="contactDetails"
                                initialData={{
                                    ...mergedEmployeeData,
                                    ...(mergedEmployeeData?.contactDetails || {})
                                }}
                                onSubmit={handleSubmit}
                            />
                            <div className="mt-4 space-x-4">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )
        },
        emergencyContacts: {
            label: "Emergency Contacts",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Update Emergency Contacts</h2>
                    {loading ? (
                        <div>Loading employee data...</div>
                    ) : (
                        <>
                            <EmployeeForm 
                                section="emergencyContacts"
                                initialData={mergedEmployeeData?.emergencyContacts && mergedEmployeeData.emergencyContacts.length > 0
                                    ? mergedEmployeeData.emergencyContacts[0]
                                    : {}}
                                onSubmit={handleSubmit}
                            />
                            <div className="mt-4 space-x-4">
                                <Button 
                                    variant="secondary" 
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            )
        }
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
                    <p className="text-gray-500">Loading employee data...</p>
                </div>
            </div>
        );
    }

    const profileHeader = (
        <div className="space-y-4 text-center p-4 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-700">
                Edit Profile: {mergedEmployeeData?.surname} {mergedEmployeeData?.last_name}
            </h2>
            <Avatar 
                className="w-26 h-26 mx-auto"
                src="/src/assets/profile.png"
            />
        </div>
    );

    return (
        <div className="container mx-auto">
            {/* <div className="mb-4">
                <Button 
                    variant="secondary" 
                    onClick={handleCancel}
                >
                    Back to Profile
                </Button>
            </div> */}

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

export default UpdateProfile;