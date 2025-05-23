import React, { useState } from 'react';
import { 
  DocumentArrowUpIcon, 
  XMarkIcon,
  CheckIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const UploadDocuments = () => {
  const [files, setFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});
  const [documentType, setDocumentType] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setUploadStatus(prevStatus => {
      const newStatus = {...prevStatus};
      delete newStatus[index];
      return newStatus;
    });
  };

  const uploadFiles = async () => {
    if (!documentType || !documentTitle || files.length === 0) {
      setError('Please provide document type, title and select at least one file');
      return;
    }
    
    setError('');
    setIsUploading(true);
    
    // Simulate file upload with delays
    for (let i = 0; i < files.length; i++) {
      setUploadStatus(prev => ({...prev, [i]: 'uploading'}));
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUploadStatus(prev => ({...prev, [i]: 'completed'}));
    }
    
    setIsUploading(false);
    
    // Simulate success message
    setTimeout(() => {
      alert('All documents uploaded successfully!');
      setFiles([]);
      setUploadStatus({});
      setDocumentTitle('');
    }, 1000);
  };

  const documentTypes = [
    { id: 'policy', name: 'HR Policy' },
    { id: 'procedure', name: 'Procedure' },
    { id: 'guideline', name: 'Guideline' },
    { id: 'manual', name: 'Employee Manual' },
    { id: 'form', name: 'Form Template' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Upload HR Documents</h1>
        <p className="text-gray-600 mb-6">
          Upload HR policies, procedures, and guidelines for the AI assistant to use as reference.
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <ExclamationCircleIcon className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Type
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select document type</option>
              {documentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="E.g., Employee Leave Policy"
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Files
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Drag and drop files here, or click to select files
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports PDF, DOCX, TXT (Max 10MB per file)
                </p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.docx,.txt"
              />
              <label
                htmlFor="file-upload"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Select Files
              </label>
            </div>
          </div>
          
          {files.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Files</h3>
              <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                {files.map((file, index) => (
                  <li key={index} className="px-4 py-3 flex items-center justify-between bg-white">
                    <div className="flex items-center">
                      <DocumentArrowUpIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <div className="flex items-center">
                      {uploadStatus[index] === 'uploading' && (
                        <span className="text-xs text-blue-500 mr-3">Uploading...</span>
                      )}
                      {uploadStatus[index] === 'completed' && (
                        <CheckIcon className="h-5 w-5 text-green-500 mr-3" />
                      )}
                      <button 
                        onClick={() => removeFile(index)}
                        disabled={isUploading}
                        className={`text-gray-400 hover:text-gray-500 ${isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="flex justify-end">
            <button
              onClick={uploadFiles}
              disabled={isUploading || files.length === 0}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                isUploading || files.length === 0 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none'
              }`}
            >
              {isUploading ? 'Uploading...' : 'Upload Documents'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadDocuments;
