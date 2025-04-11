import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTemplates } from '../../../redux/templateSlice';
import { useTemplateFilters } from '../../../hooks/templates/useTemplateFilters';
import { useTemplatePagination } from '../../../hooks/templates/useTemplatePagination';
import { useToast, ToastContainer } from '../../../hooks/useToast';
import FilterBox from '../../../components/ui/FilterBox';
import TemplateToolbar from './TemplateToolbar';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import TemplateActions from './TemplateActions';
import DeleteTemplate from './DeleteTemplate';
import PreviewTemplate from './PreviewTemplate';
import CopyTemplate from './CopyTemplate';
import Pagination from '../../../components/ui/Pagination';

const TemplateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allTemplates, loading, error } = useSelector((state) => state.templates);
  const { toast } = useToast();

  const [templateToDelete, setTemplateToDelete] = useState(null);
  const [templateToPreview, setTemplateToPreview] = useState(null);
  const [templateToCopy, setTemplateToCopy] = useState(null);
  const { filteredTemplates, filterProps } = useTemplateFilters(allTemplates);
  const { paginatedTemplates, paginationProps } = useTemplatePagination(filteredTemplates);

  useEffect(() => {
    dispatch(fetchTemplates());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/performance/templates/edit/${id}`);
  };

  const handleAddTemplate = () => {
    navigate('/performance/templates/add');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    toast({
      title: 'Error',
      description: 'Failed to fetch templates. Please try again later.',
      variant: 'destructive',
    });
  }

return (
    <div className="w-full p-4 mt-8">
        <ToastContainer />
        <DeleteTemplate
            templateToDelete={templateToDelete}
            setTemplateToDelete={setTemplateToDelete}
        />
        <PreviewTemplate
            templateToPreview={templateToPreview}
            setTemplateToPreview={setTemplateToPreview}
        />
        <CopyTemplate
            templateToCopy={templateToCopy}
            setTemplateToCopy={setTemplateToCopy}
        />

        <FilterBox
            title="Template List"
            filters={[
                {
                    id: 'filterText',
                    label: 'Template Name',
                    type: 'search',
                    placeholder: 'Type for template name...',
                    value: filterProps.filterText,
                    onChange: (e) => filterProps.setFilterText(e.target.value),
                },
                {
                    id: 'filterReviewPeriod',
                    label: 'Review Period',
                    type: 'select',
                    value: filterProps.filterReviewPeriod,
                    onChange: (e) => filterProps.setFilterReviewPeriod(e.target.value),
                    options: [
                        { value: '', label: '-- Select --' },
                        { value: 'Probation 6 months', label: 'Probation 6 months' },
                        { value: 'Mid Term Review', label: 'Mid Term Review' },
                        { value: 'Annual Review', label: 'Annual Review' },
                    ],
                },
                {
                    id: 'filterYear',
                    label: 'Year',
                    type: 'select',
                    value: filterProps.filterYear || '2025',
                    onChange: (e) => filterProps.setFilterYear(e.target.value),
                    options: [
                        { value: '', label: '-- Select --' },
                        { value: '2025', label: '2025' },
                        // { value: '2026', label: '2026' },
                    //   { value: '2027', label: '2027' },
                    ],
                },
            ]}
            buttons={[
                {
                    label: 'Reset',
                    variant: 'secondary',
                    onClick: filterProps.handleReset,
                },
            ]}
        />

        <div className="bg-gray-100 p-4 rounded-lg mb-4 shadow-sm">
            <TemplateToolbar
                onAddTemplate={handleAddTemplate}
                recordsPerPage={paginationProps.recordsPerPage}
                onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
                totalRecords={filteredTemplates.length}
            />

            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Name</TableHeader>
                        <TableHeader>Created By</TableHeader>
                        <TableHeader>Job Title</TableHeader>
                        <TableHeader>Created</TableHeader>
                        <TableHeader>Review Period</TableHeader>
                        <TableHeader>Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedTemplates.map((template) => (
                        <TableRow key={template.id}>
                            <TableCell>{template.name}</TableCell>
                            <TableCell>
                                {template.user?.surname} {template.user?.last_name}
                            </TableCell>
                            <TableCell>{template.user?.job_title?.name || 'N/A'}</TableCell>
                            <TableCell>{new Date(template.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{template.review_period || 'N/A'}</TableCell>
                            <TableCell>
                                <TemplateActions
                                    template={template}
                                    onEdit={handleEdit}
                                    onDelete={setTemplateToDelete}
                                    onPreview={setTemplateToPreview}
                                    onCopy={setTemplateToCopy}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Pagination
                currentPage={paginationProps.currentPage}
                totalPages={paginationProps.totalPages}
                onPageChange={paginationProps.handlePageChange}
            />
        </div>
    </div>
);
};

export default TemplateList;
