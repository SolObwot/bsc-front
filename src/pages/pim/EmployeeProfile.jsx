import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service';
import {employeeService} from '../../services/employee.service';
import Tabs from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/avatar';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import EmployeeForm from './EmployeeForm';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Tables';
import Button from '../../components/ui/Button';

const EmployeeProfile = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("personalDetails");
    const [employeeBasic, setEmployeeBasic] = useState(null);
    const [employeeContacts, setEmployeeContacts] = useState(null);
    const [showEmergencyContactForm, setShowEmergencyContactForm] = useState(false);
    const [editingContactIndex, setEditingContactIndex] = useState(null);
    const [mergedEmployeeData, setMergedEmployeeData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch basic user data
                const basicResponse = await userService.getUser(id);
                setEmployeeBasic(basicResponse.data);
                
                // Fetch contact details
                const contactsResponse = await employeeService.getEmployeeContacts(id);
                setEmployeeContacts(contactsResponse.data);
                
                // Merge the data
                setMergedEmployeeData({
                    ...basicResponse.data,
                    ...contactsResponse.data
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
            } else if (activeTab === 'contactDetails' || activeTab === 'emergencyContacts') {
                await employeeService.updateContact(id, formData);
            }
            
            // Refresh data after update
            const basicResponse = await userService.getUser(id);
            const contactsResponse = await employeeService.getEmployeeContacts(id);
            
            setEmployeeBasic(basicResponse.data);
            setEmployeeContacts(contactsResponse.data);
            setMergedEmployeeData({
                ...basicResponse.data,
                ...contactsResponse.data
            });
            
            // Add success notification here if needed
        } catch (error) {
            console.error('Error updating employee:', error);
            // Add error notification here if needed
        }
    };

    // const handleSubmit = async (section, formData) => {
    //     try {
    //         // Different API calls based on the section
    //         switch(section) {
    //             case 'personalDetails':
    //                 await employeeService.updateEmployee(id, formData);
    //                 break;
    //             case 'contactDetails':
    //                 await employeeService.updateEmployeeContact(id, formData);
    //                 break;
    //             // ...
    //         }
            
    //         await mutate(); // Refresh the data after successful update
    //         // Show success toast
    //     } catch (error) {
    //         // Handle error and show error toast
    //     }
    // };

    const tabs = {
        personalDetails: {
            label: "Personal Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Personal Details</h2>
                    {loading ? (
                        <div>Loading employee data...</div>
                    ) : (
                        <EmployeeForm 
                            section="personalDetails"
                            initialData={mergedEmployeeData}
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            )
        },
        contactDetails: {
            label: "Contact Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">Contact Details</h2>
                    {loading ? (
                        <div>Loading employee data...</div>
                    ) : (
                        <EmployeeForm
                            section="contactDetails"
                            initialData={
                                employeeContacts !== null && employeeContacts.length > 0
                                    ? { ...mergedEmployeeData, ...employeeContacts[0] }
                                    : mergedEmployeeData
                            }
                            onSubmit={handleSubmit}
                        />
                    )}
                </div>
            )
        },
        emergencyContacts: {
            label: "Emergency Contacts",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">Emergency Contacts</h2>
                    </div>
                    
                    {!loading && !showEmergencyContactForm && (
                        <Button 
                            variant="pride" 
                            className="mb-4"
                            onClick={() => {
                                setShowEmergencyContactForm(true);
                                setEditingContactIndex(null);
                            }}
                        >
                            Add Emergency Contact
                        </Button>
                    )}
        
                    {!loading && showEmergencyContactForm && (
                        <>
                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    {editingContactIndex !== null ? 'Edit' : 'Add'} Emergency Contact
                                </h3>
                                <EmployeeForm 
                                    section="emergencyContacts"
                                    initialData={editingContactIndex !== null 
                                        ? mergedEmployeeData[editingContactIndex] 
                                        : {}}
                                    onSubmit={(formData) => {
                                        handleSubmit(formData);
                                        setShowEmergencyContactForm(false);
                                    }}
                                />
                                <Button 
                                    variant="secondary" 
                                    className="mt-2"
                                    onClick={() => setShowEmergencyContactForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </>
                    )}
                 
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Relationship</TableHeader>
                                <TableHeader>Phone</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mergedEmployeeData ? (
                                Object.values(mergedEmployeeData).map((contact, index) => (
                                    contact?.emergency_contact_name && (
                                        <TableRow key={index}>
                                            <TableCell>{contact.emergency_contact_name}</TableCell>
                                            <TableCell>{contact.emergency_contact_relations}</TableCell>
                                            <TableCell>{contact.emergency_contact_phone}</TableCell>
                                            <TableCell>
                                                <button 
                                                    className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer"
                                                    onClick={() => {
                                                        setEditingContactIndex(index);
                                                        setShowEmergencyContactForm(true);
                                                    }}
                                                >
                                                    <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
                                                    <span>Edit</span>
                                                </button>
                                                <button className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 cursor-pointer">
                                                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                    <span>Delete</span>
                                                </button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" className="text-center py-4">
                                        No emergency contacts found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
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
                    <p className="text-gray-500">Loading employee profile...</p>
                </div>
            </div>
        );
    }

    const profileHeader = (
        <div className="space-y-4 text-center p-4 bg-gray-50">
            <h2 className="text-xl font-medium text-gray-700">
                {mergedEmployeeData?.first_name} {mergedEmployeeData?.last_name}
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
