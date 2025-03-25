import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../../services/user.service';
import {employeeService} from '../../services/employee.service';
import Tabs from '../../components/ui/Tabs';
import { Avatar } from '../../components/ui/avatar';
import { PencilSquareIcon, TrashIcon, PaperClipIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid';
import EmployeeForm from './EmployeeForm';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Tables';
import Button from '../../components/ui/Button';
import SensitiveData from '../../components/ui/SensitiveData';

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

    const tabs = {
        personalDetails: {
            label: "Personal Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">{tabs.personalDetails.label}</h2>
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
        otherDetails: {
            label: "Other Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">{tabs.otherDetails.label}</h2>
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
        employementDetails: {
            label: "Employment Details",
            content: () => (
                <div className="p-6">
                    <h2 className="text-xl font-medium text-gray-700 mb-4">{tabs.employementDetails.label}</h2>
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
        qualificationDetails: {
            label: "Qualification",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.qualificationDetails.label}</h2>
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
        },
        emergencyContacts: {
            label: "Emergency Contact",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.emergencyContacts.label}</h2>
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
                                            <TableCell>
                                                <SensitiveData data={contact.emergency_contact_phone} />  
                                            </TableCell>
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
        },
        nextOfKin: {
            label: "Next Of Kin",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.nextOfKin.label}</h2>
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
                                            <TableCell>
                                                <SensitiveData data={contact.emergency_contact_phone} />  
                                            </TableCell>
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
        },
        dependantDetails: {
            label: "Dependants",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.dependantDetails.label}</h2>
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
        },
        workHistory: {
            label: "Work Experiences",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.workHistory.label}</h2>
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
        },
        refereeDetails: {
            label: "Referee Details",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.refereeDetails.label}</h2>
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
        },
        documentDetails: {
            label: "Documents ",
            content: () => (
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-medium text-gray-700">{tabs.documentDetails.label}</h2>
                    </div>
                    
                    <Button 
                        variant="pride" 
                        className="mb-2 flex items-center"> 
                        <PaperClipIcon aria-hidden="true" className="size-5 shrink-0 text-white mr-2" />
                        Add Attachments
                    </Button>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeader>File Name</TableHeader>
                                <TableHeader>Description</TableHeader>
                                <TableHeader>Size</TableHeader>
                                <TableHeader>Date Added</TableHeader>
                                <TableHeader>Action</TableHeader>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mergedEmployeeData ? (
                                Object.values(mergedEmployeeData).map((contact, index) => (
                                    contact?.emergency_contact_name && (
                                        <TableRow key={index}>
                                            <TableCell>coverletter_back_end_developer.pdf</TableCell>
                                            <TableCell>ACCA</TableCell>
                                            <TableCell><span className="shrink-0 text-gray-400">4.5mb</span></TableCell>
                                            <TableCell>12/09/2024</TableCell>
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
                                                <button className="text-red-600 hover:text-red-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer">
                                                    <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                    <span>Delete</span>
                                                </button>
                                                <button className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-x-1.5 mr-2 cursor-pointer">
                                                    <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
                                                    <span>Download</span>
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
                {mergedEmployeeData?.surname} {mergedEmployeeData?.last_name}({mergedEmployeeData?.staff_number})
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
