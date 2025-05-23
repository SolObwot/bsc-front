import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DocumentTextIcon,
  ArrowPathIcon,
  FolderIcon
} from '@heroicons/react/24/outline';
import FilterBox from '../../components/ui/FilterBox';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../components/ui/Tables';
import Pagination from '../../components/ui/Pagination';
import AssistantToolbar from './AssistantToolbar';
import AssistantActions from './AssistantActions';

const AssistantList = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  
  // Document to act upon
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [documentToView, setDocumentToView] = useState(null);

  // Mock data for documents
  useEffect(() => {
    // Simulate API call to fetch documents
    setTimeout(() => {
      const mockDocuments = [
        { 
          id: 1, 
          title: 'Employee Handbook', 
          type: 'manual',
          format: 'pdf',
          description: 'Comprehensive guide to company policies and procedures',
          dateAdded: '2023/06/15', 
          lastUpdated: '2023-11-01',
          size: '4.2 MB'
        },
        { 
          id: 2, 
          title: 'Leave Policy', 
          type: 'policy',
          format: 'docx',
          description: 'Guidelines for requesting and managing employee leave',
          dateAdded: '2023/08/20', 
          lastUpdated: '2023-08-20',
          size: '1.5 MB'
        },
        { 
          id: 3, 
          title: 'Performance Review Procedure', 
          type: 'procedure',
          format: 'pdf',
          description: 'Steps for conducting employee performance reviews',
          dateAdded: '2023/07/10', 
          lastUpdated: '2023-10-15',
          size: '2.1 MB'
        },
        { 
          id: 4, 
          title: 'Code of Conduct', 
          type: 'policy',
          format: 'pdf',
          description: 'Standards for professional behavior in the workplace',
          dateAdded: '2023/05/05', 
          lastUpdated: '2023-09-22',
          size: '3.7 MB'
        },
        { 
          id: 5, 
          title: 'Recruitment and Selection Policy', 
          type: 'policy',
          format: 'xlsx',
          description: 'Framework for hiring new employees',
          dateAdded: '2023/04/18', 
          lastUpdated: '2023-10-30',
          size: '2.8 MB'
        }
      ];
      
      setDocuments(mockDocuments);
      setFilteredDocuments(mockDocuments);
      setIsLoading(false);
    }, 1200);
  }, []);

  // Apply filters when filter states change
  useEffect(() => {
    filterDocuments();
  }, [searchTerm, typeFilter, dateFilter, documents]);

  const filterDocuments = () => {
    let filtered = [...documents];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by type
    if (typeFilter) {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }
    
    // Filter by date (simplified for this example)
    if (dateFilter) {
      filtered = filtered.filter(doc => {
        const docYear = new Date(doc.dateAdded).getFullYear().toString();
        return docYear === dateFilter;
      });
    }
    
    setFilteredDocuments(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleReset = () => {
    setSearchTerm('');
    setTypeFilter('');
    setDateFilter('');
  };

  // Pagination functions
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRecordsPerPageChange = (value) => {
    setRecordsPerPage(value);
    setCurrentPage(1); // Reset to first page
  };

  const totalPages = Math.ceil(filteredDocuments.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const paginatedDocuments = filteredDocuments.slice(indexOfFirstRecord, indexOfLastRecord);

  // Action handlers
  const handleAddDocument = () => {
    navigate('/hr/policy/upload');
  };

  const handleStartChat = () => {
    navigate('/hr/policy/chat');
  };

  const handleChat = (document) => {
    navigate(`/hr/policy/chat?document=${document.id}`);
  };

  const handleView = (document) => {
    setDocumentToView(document);
    // In a real implementation, show a modal or navigate to view page
    alert(`Viewing document: ${document.title}`);
  };

  const handleDownload = (document) => {
    // In a real implementation, trigger download
    alert(`Downloading document: ${document.title}`);
  };

  const handleEdit = (document) => {
    // In a real implementation, navigate to edit page
    alert(`Editing document: ${document.title}`);
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    // In a real implementation, show confirmation modal
    if (window.confirm(`Are you sure you want to delete "${document.title}"?`)) {
      // Remove from state (would be an API call in real app)
      setDocuments(docs => docs.filter(d => d.id !== document.id));
    }
  };

  const getDocumentTypeLabel = (type) => {
    switch (type) {
      case 'policy': return 'Policy';
      case 'procedure': return 'Procedure';
      case 'manual': return 'Manual';
      case 'guideline': return 'Guideline';
      case 'form': return 'Form';
      default: return 'Document';
    }
  };

  const getFormatLabel = (format) => {
    switch (format.toLowerCase()) {
      case 'pdf':
        return { label: 'PDF', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      case 'docx':
      case 'doc':
        return { label: 'DOCX', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'xlsx':
      case 'xls':
        return { label: 'Excel', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'pptx':
      case 'ppt':
        return { label: 'PowerPoint', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
      case 'txt':
        return { label: 'TXT', bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
      default:
        return { label: format.toUpperCase(), bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };

  return (
    <div className="w-full p-4 mt-8">
      <FilterBox
        title="Policy Explorer"
        description="Browse and search through HR documents and policies"
        filters={[
          {
            id: 'searchTerm',
            label: 'Search',
            type: 'search',
            placeholder: 'Search by title or description...',
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
          },
          {
            id: 'typeFilter',
            label: 'Document Type',
            type: 'select',
            value: typeFilter,
            onChange: (e) => setTypeFilter(e.target.value),
            options: [
              { value: '', label: '-- All Types --' },
              { value: 'policy', label: 'Policy' },
              { value: 'procedure', label: 'Procedure' },
              { value: 'manual', label: 'Manual' },
              { value: 'guideline', label: 'Guideline' },
              { value: 'form', label: 'Form' },
            ],
          },
          {
            id: 'dateFilter',
            label: 'Year Added',
            type: 'select',
            value: dateFilter,
            onChange: (e) => setDateFilter(e.target.value),
            options: [
              { value: '', label: '-- All Years --' },
              { value: '2023', label: '2023' },
              { value: '2022', label: '2022' },
              { value: '2021', label: '2021' },
            ],
          },
        ]}
        buttons={[
          {
            label: 'Reset Filters',
            variant: 'secondary',
            onClick: handleReset,
          },
        ]}
      />

      <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
        <AssistantToolbar 
          recordsPerPage={recordsPerPage}
          onRecordsPerPageChange={handleRecordsPerPageChange}
          totalRecords={filteredDocuments.length}
          onAddDocument={handleAddDocument}
          onStartChat={handleStartChat}
        />

        {isLoading ? (
          <div className="bg-white rounded-lg p-16 flex flex-col items-center justify-center">
            <ArrowPathIcon className="h-10 w-10 text-gray-400 animate-spin mb-4" />
            <p className="text-gray-500">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="bg-white rounded-lg p-16 flex flex-col items-center justify-center">
            <FolderIcon className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No documents found</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm || typeFilter || dateFilter
                ? 'Try adjusting your filters to find more documents'
                : 'Upload some documents to get started'}
            </p>
          </div>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Document Title</TableHeader>
                  <TableHeader>Description</TableHeader>
                  <TableHeader>Added</TableHeader>
                  <TableHeader>Size</TableHeader>
                  <TableHeader>Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedDocuments.map(document => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{document.title}</span>
                        <div className="flex space-x-2 mt-1">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit">
                            {getDocumentTypeLabel(document.type)}
                          </span>
                          {document.format && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFormatLabel(document.format).bgColor} ${getFormatLabel(document.format).textColor} w-fit`}>
                              {getFormatLabel(document.format).label}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{document.description}</TableCell>
                    <TableCell>{document.dateAdded}</TableCell>
                    <TableCell>{document.size}</TableCell>
                    <TableCell>
                      <AssistantActions
                        document={document}
                        onChat={handleChat}
                        onView={handleView}
                        onDownload={handleDownload}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AssistantList;
