import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCourses } from '../../../redux/courseSlice';
import { useCourseFilters } from '../../../hooks/courses/useCourseFilters';
import { useCoursePagination } from '../../../hooks/courses/useCoursePagination';
import { useToast, ToastContainer } from "../../../hooks/useToast";
import FilterBox from '../../../components/ui/FilterBox';
import CourseToolbar from './CourseToolbar';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import CourseActions from './CourseActions';
import DeleteCourse from './DeleteCourse';
import Pagination from '../../../components/ui/Pagination';

const CourseList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allCourses, loading, error } = useSelector((state) => state.courses);
  const { toast } = useToast();

  const [courseToDelete, setCourseToDelete] = useState(null);
  const { filteredCourses, filterProps } = useCourseFilters(allCourses);
  const { paginatedCourses, paginationProps } = useCoursePagination(filteredCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleEdit = (id) => {
    navigate(`/admin/qualification/course/edit/${id}`);
  };

  const handleAddCourse = () => {
    navigate('/admin/qualification/course/add');
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

        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Short Code</TableHeader>
              <TableHeader>Course Name</TableHeader>
              <TableHeader>Actions</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCourses.map((course) => (
              <TableRow key={course.id}>
                <TableCell>{course.short_code}</TableCell>
                <TableCell>{course.name}</TableCell>
                <TableCell>
                  <CourseActions
                    course={course}
                    onEdit={handleEdit}
                    onDelete={setCourseToDelete}
                    onArchive={setCourseToDelete}
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

export default CourseList;