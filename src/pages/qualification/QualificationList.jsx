import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Table, { TableHead, TableRow, TableHeader, TableBody, TableCell } from '../../components/ui/Tables';

const QualificationList = () => {
  const { type } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">{type} List</h1>
      <Link to={`/admin/qualification/${type}/add`} className="btn btn-primary mb-4">Add {type}</Link>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Short Code</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Action</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Replace with dynamic data */}
          <TableRow>
            <TableCell>SC001</TableCell>
            <TableCell>Sample {type}</TableCell>
            <TableCell>
              <button className="btn btn-sm btn-warning mr-2">Edit</button>
              <button className="btn btn-sm btn-danger">Delete</button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default QualificationList;
