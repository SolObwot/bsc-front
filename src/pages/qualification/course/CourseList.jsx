import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses, createCourse, updateCourse } from '../../../redux/courseSlice';
import { useCourseFilters } from '../../../hooks/courses/useCourseFilters';
import { useCoursePagination } from '../../../hooks/courses/useCoursePagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from '../../../components/ui/FilterBox';
import CourseToolbar from './CourseToolbar';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeader, TableSkeleton } from '../../../components/ui/Tables';
import CourseActions from './CourseActions';
import DeleteCourse from './DeleteCourse';
import Pagination from '../../../components/ui/Pagination';
import CourseModal from './CourseModal';

const CourseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCourses, loading, error } = useSelector((state) => state.courses);
  const { toast } = useToast();

  // Modal state management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  
  const { filteredCourses, filterProps } = useCourseFilters(allCourses);
  const { paginatedCourses, paginationProps } = useCoursePagination(filteredCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  // Update edit handler to use modal
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  // Update add handler to use modal
  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsAddModalOpen(true);
  };

  // Add handlers for modal submissions
  const handleAddSubmit = async (newCourse) => {
    try {
      await dispatch(createCourse(newCourse)).unwrap();
      setIsAddModalOpen(false);
      toast({
        title: "Success",
        description: "Course created successfully!",
      });
      dispatch(fetchCourses());
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (updatedCourse) => {
    try {
      await dispatch(updateCourse({ 
        id: selectedCourse.id, 
        formData: updatedCourse 
      })).unwrap();
      setIsEditModalOpen(false);
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
      dispatch(fetchCourses());
      setSelectedCourse(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch courses. Please try again later.",
      variant: "destructive",
    });
  }

  return (
    <div className="w-full p-4 mt-8">
      <ToastContainer />
      <DeleteCourse
        courseToDelete={courseToDelete}
        setCourseToDelete={setCourseToDelete}
      />

      <FilterBox
        title="Course List"
        filters={[
          {
            id: 'filterText',
            label: 'Course Name',
            type: 'search',
            placeholder: 'Type for course name...',
            value: filterProps.filterText,
            onChange: (e) => filterProps.setFilterText(e.target.value),
          },
          {
            id: 'filterShortCode',
            label: 'Short Code',
            type: 'search',
            placeholder: 'Type for short code...',
            value: filterProps.filterShortCode,
            onChange: (e) => filterProps.setFilterShortCode(e.target.value),
          },
          {
            id: 'filterStatus',
            label: 'Status',
            type: 'select',
            value: filterProps.filterStatus,
            onChange: (e) => filterProps.setFilterStatus(e.target.value),
            options: [
              { value: '', label: '-- Select --' },
              { value: 'enabled', label: 'Active' },
              { value: 'disabled', label: 'Inactive' },
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
        <CourseToolbar
          onAddCourse={handleAddCourse}
          recordsPerPage={paginationProps.recordsPerPage}
          onRecordsPerPageChange={paginationProps.handleRecordsPerPageChange}
          totalRecords={filteredCourses.length}
        />

        {loading ? (
          <TableSkeleton 
            rows={5} 
            columns={3} 
            columnWidths={['20%', '60%', '20%']} 
          />
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Short Code</TableHeader>
                <TableHeader>Course Name</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    No courses found. Click "Add New Course" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.short_code}</TableCell>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <CourseActions
                        course={course}
                        onEdit={() => handleEdit(course)}
                        onDelete={setCourseToDelete}
                        onArchive={setCourseToDelete}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        <Pagination
          currentPage={paginationProps.currentPage}
          totalPages={paginationProps.totalPages}
          onPageChange={paginationProps.handlePageChange}
        />
      </div>

      {/* Add Course Modal */}
      <CourseModal
        isOpen={isAddModalOpen}
        closeModal={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        initialData={null}
      />
      
      {/* Edit Course Modal */}
      {selectedCourse && (
        <CourseModal
          isOpen={isEditModalOpen}
          closeModal={() => {
            setIsEditModalOpen(false);
            setSelectedCourse(null);
          }}
          onSubmit={handleEditSubmit}
          initialData={selectedCourse}
        />
      )}
    </div>
  );
};

export default CourseList;