import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  DocumentTextIcon, 
  CheckCircleIcon, 
  XMarkIcon, 
  ArrowLeftIcon,
  ArrowPathIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PencilSquareIcon,
  DocumentArrowUpIcon
} from '@heroicons/react/24/outline';
import Button from '../../components/ui/Button';

const UndertakingForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [undertaking, setUndertaking] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSignatureSelector, setShowSignatureSelector] = useState(false);
  const [selectedSignature, setSelectedSignature] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const defaultSignatures = [
    {
      id: 1,
      name: 'Signature 1',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='70' viewBox='0 0 200 70'%3E%3Cpath d='M20,50 C30,40 40,30 50,35 C60,40 60,55 70,50 C85,40 90,15 110,20 C130,25 140,45 160,40' stroke='black' fill='transparent' stroke-width='2'/%3E%3C/svg%3E"
    },
    {
      id: 2,
      name: 'Signature 2',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='70' viewBox='0 0 200 70'%3E%3Cpath d='M10,40 C20,20 40,60 60,40 C80,20 100,50 120,30 C140,10 160,40 180,30' stroke='black' fill='transparent' stroke-width='2'/%3E%3C/svg%3E"
    },
    {
      id: 3,
      name: 'Signature 3',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='70' viewBox='0 0 200 70'%3E%3Cpath d='M20,35 Q40,10 60,35 T100,35 T140,35 T180,35' stroke='black' fill='transparent' stroke-width='2'/%3E%3C/svg%3E"
    },
    {
      id: 4,
      name: 'Signature 4',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='70' viewBox='0 0 200 70'%3E%3Cpath d='M30,50 C50,30 50,50 70,30 S90,50 110,30 S130,50 150,30' stroke='black' fill='transparent' stroke-width='2'/%3E%3C/svg%3E"
    }
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setIsViewMode(searchParams.get('mode') === 'view');
  }, [location]);
  
  useEffect(() => {
    const fetchUndertaking = async () => {
      setIsLoading(true);
      
      setTimeout(() => {
        const mockUndertaking = {
          id: parseInt(id),
          title: id === '1' ? 'Code of Ethical Conduct' : 
                 id === '2' ? 'HR Policy Manual' : 
                 id === '3' ? 'Sexual Harassment Declaration' :
                 id === '4' ? 'Anti-Fraud Undertaking' : 'Confidentiality Acknowledgement',
          type: id === '1' ? 'ethics' : 
                id === '2' ? 'policy' : 
                id === '3' ? 'declaration' :
                id === '4' ? 'anti-fraud' : 'confidentiality',
          year: '2023',
          description: `Annual declaration for ${new Date().getFullYear()}`,
          content: getContentForType(id),
          dateIssued: '2023-01-15',
          dueDate: '2023-02-15',
          status: id === '1' || id === '3' ? 'signed' : 'pending',
          signedDate: id === '1' || id === '3' ? '2023-01-20' : null,
          signatureImage: id === '1' || id === '3' ? 'data:image/png;base64,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' : null
        };
        
        setUndertaking(mockUndertaking);
        setIsLoading(false);
      }, 1000);
    };
    
    if (id) {
      fetchUndertaking();
    } else {
      setUndertaking({
        title: '',
        type: '',
        year: new Date().getFullYear().toString(),
        description: '',
        content: '',
        dateIssued: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'draft'
      });
      setIsLoading(false);
    }
  }, [id]);

  const getContentForType = (id) => {
    if (id === '1') {
      return `<h3 class="font-bold text-lg">CODE OF ETHICAL CONDUCT</h3>
      <p class="my-3">As an employee of Pride Microfinance Ltd, I am committed to the highest ethical standards in conduct of my professional duties. I hereby undertake to:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Maintain the highest level of integrity, professionalism and ethical standards in all my dealings.</li>
        <li>Comply with all regulatory requirements, laws and company policies.</li>
        <li>Avoid conflicts of interest and disclose any potential conflicts to management.</li>
        <li>Protect confidential information about the organization, customers and colleagues.</li>
        <li>Treat all colleagues, customers and stakeholders with respect and dignity.</li>
        <li>Avoid discriminatory practices based on race, gender, religion, or any other protected characteristic.</li>
        <li>Report any suspected violations of the code of conduct.</li>
        <li>Safeguard company assets and use them responsibly.</li>
      </ol>
      <p class="my-3">I understand that failure to adhere to this code may result in disciplinary action, including possible termination of employment.</p>
      <div class="mt-6">
        <p>If the above acknowledgement is acceptable to you, please indicate your acceptance by signing and dating this statement in duplicate and returning one copy to us.</p>
        <p class="mt-2"><strong>Signed:</strong> ____________________________________________</p>
        <p><strong>HEAD PEOPLE AND CULTURE</strong></p>
        <p><strong>Date:</strong>_________________________</p>
        <p class="mt-4">I have read, understood, accept and declare that I will fully abide by the ethical code as stated above.</p>
        <p><strong>Name:</strong>________________________________ <strong>Designation:</strong>_______________________</p>
        <p><strong>Signature:</strong>_____________________________ <strong>Date:</strong>__________________________</p>
      </div>`;
    } else if (id === '2') {
      return `<h3 class="font-bold text-lg">HR POLICY MANUAL ACKNOWLEDGEMENT</h3>
      <p class="my-3">I acknowledge that I have received, read, and understood the Pride Microfinance Ltd Employee Handbook and HR Policy Manual. I understand that it contains important information about the company's policies, procedures, benefits, and expectations, as well as my responsibilities as an employee.</p>
      <p class="my-3">I understand and acknowledge that:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>It is my responsibility to read and comply with the policies in the handbook and any revisions made to it.</li>
        <li>The handbook is not an employment contract and does not guarantee employment for any specific duration.</li>
        <li>The company reserves the right to modify, revoke, suspend, terminate, or change any or all policies, in whole or in part, at any time, with or without prior notice.</li>
        <li>The current version of the handbook supersedes all previous versions.</li>
      </ol>
      <div class="mt-6">
        <p>If the above acknowledgement is acceptable to you, please indicate your acceptance by signing and dating this statement in duplicate and returning one copy to us.</p>
        <p class="mt-2"><strong>Signed:</strong> ____________________________________________</p>
        <p><strong>HEAD PEOPLE AND CULTURE</strong></p>
        <p><strong>Date:</strong>_________________________</p>
        <p class="mt-4">I have read, understood, accept and declare that I will fully abide by the policies as stated above.</p>
        <p><strong>Name:</strong>________________________________ <strong>Designation:</strong>_______________________</p>
        <p><strong>Signature:</strong>_____________________________ <strong>Date:</strong>__________________________</p>
      </div>`;
    } else {
      return `<h3 class="font-bold text-lg">CONFIDENTIALITY ACKNOWLEDGEMENT</h3>
      <p class="my-3">As an employee of Pride Microfinance Ltd, I understand that during my employment I may have access to confidential information related to the company, its customers, and its operations.</p>
      <p class="my-3">By signing this acknowledgement, I agree to:</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Keep all confidential information secure and not disclose it to any unauthorized individual within or outside the organization.</li>
        <li>Use confidential information only for the purpose of carrying out my job responsibilities.</li>
        <li>Not remove confidential information from company premises without proper authorization.</li>
        <li>Return all confidential information upon termination of employment.</li>
        <li>Continue to maintain confidentiality even after my employment with the company ends.</li>
        <li>Report any actual or suspected breach of confidentiality.</li>
      </ol>
      <p class="my-3">I understand that breach of this confidentiality agreement may result in disciplinary action, termination of employment, and possible legal action.</p>
      <div class="mt-6">
        <p>If the above acknowledgement is acceptable to you, please indicate your acceptance by signing and dating this confidentiality statement in duplicate and returning one copy to us.</p>
        <p class="mt-2"><strong>Signed:</strong> ____________________________________________</p>
        <p><strong>HEAD PEOPLE AND CULTURE</strong></p>
        <p><strong>Date:</strong>_________________________</p>
        <p class="mt-4">I have read, understood, accept and declare that I will fully abide by the confidentiality obligation as stated above.</p>
        <p><strong>Name:</strong>________________________________ <strong>Designation:</strong>_______________________</p>
        <p><strong>Signature:</strong>_____________________________ <strong>Date:</strong>__________________________</p>
      </div>`;
    }
  };
  
  const handleGoBack = () => {
    navigate('/hr/annual-undertaking/view');
  };
  
  const handleOpenSignatureSelector = () => {
    setShowSignatureSelector(true);
  };

  const handleCloseSignatureSelector = () => {
    setShowSignatureSelector(false);
  };

  const handleSelectSignature = (signature) => {
    setSelectedSignature(signature);
    setTimeout(() => {
      setShowSignatureSelector(false);
    }, 500);
  };
  
  const handleConfirmSignature = () => {
    setShowConfirmationModal(false);
    handleSubmitForm();
  };
  
  const handleSubmitForm = async () => {
    if (!selectedSignature && !user?.signatureImage) {
      setError('Please select a signature style to sign this document');
      return;
    }
    
    setIsSigning(true);
    
    setTimeout(() => {
      setUndertaking(prev => ({
        ...prev,
        status: 'signed',
        signedDate: new Date().toISOString().split('T')[0],
        signatureImage: selectedSignature?.image || user?.signatureImage,
        signedBy: {
          name: `${user?.surname} ${user?.first_name}`,
          designation: user?.job_title?.name || 'Staff',
          employeeId: user?.employee_number || '',
          date: new Date().toISOString().split('T')[0]
        }
      }));
      
      setIsSigning(false);
      setSuccessMessage('Document successfully signed and submitted!');
      
      setTimeout(() => {
        navigate('/hr/annual-undertaking/view');
      }, 2000);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col items-center justify-center h-64">
        <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin mb-4" />
        <p className="text-gray-500">Loading document...</p>
      </div>
    );
  }
  
  if (!undertaking) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Document Not Found</h2>
        <p className="text-gray-500 mb-4">The document you're looking for could not be found.</p>
        <Button 
          variant="primary" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to List
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{undertaking.title}</h2>
          <p className="text-gray-500">{undertaking.description}</p>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back
        </Button>
      </div>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <CheckCircleIcon className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <ExclamationCircleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}
      
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500">Issue Date: {undertaking.dateIssued}</p>
            <p className="text-sm text-gray-500">Due Date: {undertaking.dueDate}</p>
          </div>
          <div>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
              undertaking.status === 'signed' 
                ? 'bg-green-100 text-green-800' 
                : undertaking.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {undertaking.status.charAt(0).toUpperCase() + undertaking.status.slice(1)}
            </span>
          </div>
        </div>
        
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: undertaking.content }}
        />
      </div>
      
      {undertaking.status === 'signed' ? (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Document Signed</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Signed by: {undertaking.signedBy?.name || `${user?.surname} ${user?.first_name}`}</p>
              <p className="text-sm text-gray-500">Designation: {undertaking.signedBy?.designation || user?.job_title?.name || 'Staff'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee ID: {undertaking.signedBy?.employeeId || user?.employee_number || 'N/A'}</p>
              <p className="text-sm text-gray-500">Date: {undertaking.signedDate}</p>
            </div>
          </div>
          {undertaking.signatureImage && (
            <div className="flex justify-end">
              <div className="border border-gray-200 p-2 bg-white">
                <img 
                  src={undertaking.signatureImage} 
                  alt="Signature" 
                  className="h-16" 
                />
              </div>
            </div>
          )}
        </div>
      ) : !isViewMode && (
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Sign Document</h3>
          <p className="text-gray-500 mb-4">
            By signing this document, you acknowledge that you have read, understood, and agree to comply with all terms and conditions stated above.
          </p>
              
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
            <div className="flex items-start">
              <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <p className="text-sm text-blue-700">
                Select a signature style below to complete this document.
              </p>
            </div>
          </div>
          
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 bg-gray-50 rounded p-3">
              <label className="block text-sm text-gray-500 mb-1">Name:</label>
              <p className="font-medium">{user?.surname} {user?.first_name}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded p-3">
              <label className="block text-sm text-gray-500 mb-1">Designation:</label>
              <p className="font-medium">{user?.job_title?.name || 'Staff'}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded p-3">
              <label className="block text-sm text-gray-500 mb-1">Date:</label>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded p-3">
              <label className="block text-sm text-gray-500 mb-1">Employee ID:</label>
              <p className="font-medium">{user?.employee_number || 'N/A'}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-center mb-6">
            {selectedSignature ? (
              <div className="border border-gray-200 p-2 bg-white mb-4">
                <img 
                  src={selectedSignature.image} 
                  alt="Your signature" 
                  className="h-16" 
                />
                <p className="text-xs text-gray-500 mt-1 text-center">{selectedSignature.name}</p>
              </div>
            ) : (
              <div className="border border-gray-200 p-4 bg-gray-50 mb-4 text-center w-full">
                <p className="text-gray-500">No signature selected</p>
                <p className="text-sm text-gray-500 mt-1">
                  Please select a signature style to sign this document.
                </p>
              </div>
            )}
            
            <Button
              variant="primary"
              onClick={handleOpenSignatureSelector}
              className="flex items-center gap-2"
            >
              <PencilSquareIcon className="h-5 w-5" />
              {selectedSignature ? "Change Signature" : "Select Signature"}
            </Button>
          </div>
          
          <div className="flex justify-end space-x-3">
            {selectedSignature && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setSelectedSignature(null)}
                >
                  Reset Signature
                </Button>
                
                <Button
                  variant="pride"
                  onClick={() => setShowConfirmationModal(true)}
                  disabled={isSigning}
                  className="flex items-center gap-2"
                >
                  <CheckCircleIcon className="h-5 w-5" />
                  Sign Document
                </Button>
              </>
            )}
          </div>
        </div>
      )}
      
      {showSignatureSelector && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Select a Signature Style
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {defaultSignatures.map((sig) => (
                          <div 
                            key={sig.id}
                            onClick={() => handleSelectSignature(sig)}
                            className={`border-2 rounded-md p-4 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-500 ${
                              selectedSignature?.id === sig.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-center bg-white p-2 h-20">
                              <img 
                                src={sig.image} 
                                alt={sig.name} 
                                className="max-h-full max-w-full" 
                              />
                            </div>
                            <p className="text-sm font-medium text-center mt-2">{sig.name}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-md text-center">
                        <DocumentArrowUpIcon className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="mt-1 text-sm text-gray-500">
                          Upload your own signature
                        </p>
                        <p className="text-xs text-gray-400">Coming soon</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="secondary"
                  onClick={handleCloseSignatureSelector}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showConfirmationModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium text-gray-900">Confirm Signature</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        By signing this document, you confirm that you have read, understood, and agree to the terms and conditions described in this document.
                      </p>
                      <div className="mt-4 flex justify-center">
                        <div className="border border-gray-200 p-2 bg-white">
                          <img 
                            src={selectedSignature?.image} 
                            alt="Your signature" 
                            className="h-16" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  variant="pride"
                  onClick={handleConfirmSignature}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Sign and Submit
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmationModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UndertakingForm;
