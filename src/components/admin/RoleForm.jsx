import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import { Field, Label } from '../ui/FieldSet';
import { Checkbox } from '../ui/CheckBox';
import { PERMISSIONS } from '../../constants/permissions';

const RoleForm = ({ onSubmit, initialData = {}, onCancel }) => {
  // Initialize form state with proper typing
  const [formData, setFormData] = useState({
    name: '',
    permissions: new Set(), // Using Set for easier permission management
  });

  // Initialize permissions state based on initial data
  useEffect(() => {
    setFormData({
      name: initialData.name || '',
      // Convert array to Set for easier management
      permissions: new Set(initialData.permissions || []),
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Simplified permission handling using Set
  const handlePermissionChange = (permission) => (checked) => {
    setFormData(prev => {
      const newPermissions = new Set(prev.permissions);
      if (checked) {
        newPermissions.add(permission);
      } else {
        newPermissions.delete(permission);
      }
      return {
        ...prev,
        permissions: newPermissions,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Convert Set back to array for API
    const payload = {
      name: formData.name,
      permissions: Array.from(formData.permissions),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg mb-4 shadow-sm">
        <Field>
          <Label>Role Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter role name"
          />
        </Field>

        <Field>
          <Label>Permissions</Label>
          <div className="space-y-2">
            {Object.entries(PERMISSIONS).map(([group, permissions]) => (
              <div key={group} className="space-y-2">
                <h4 className="font-medium text-gray-700">
                  {group.replace('_', ' ').toUpperCase()}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(permissions).map(([key, permission]) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.has(permission)}
                        onCheckedChange={handlePermissionChange(permission)}
                      />
                      <label htmlFor={permission} className="text-sm font-medium leading-none">
                        {permission.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Field>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="pride"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default RoleForm;