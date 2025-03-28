import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../../../components/ui/Tables';
import Button from '../../../components/ui/Button';

const CourseList = () => {
  const navigate = useNavigate();
  const courses = [
    { id: 1, shortCode: 'CS101', name: 'Computer Science Basics' },
    { id: 2, shortCode: 'CS102', name: 'Advanced Algorithms' },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Courses</h1>
        <Button variant="pride" onClick={() => navigate('/admin/qualification/course/add')}>
          Add Course
        </Button>
      </div>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Short Code</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {courses.map((course) => (
            <TableRow key={course.id}>
              <TableCell>{course.shortCode}</TableCell>
              <TableCell>{course.name}</TableCell>
              <TableCell>
                <Button variant="secondary" onClick={() => navigate(`/admin/qualification/course/edit/${course.id}`)}>
                  Edit
                </Button>
                <Button variant="danger" className="ml-2">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseList;
