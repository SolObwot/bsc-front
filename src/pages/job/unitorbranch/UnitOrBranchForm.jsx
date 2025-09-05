import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import useUserSearch from '../../../hooks/agreements/useUserSearch';
import SearchableCombobox from '../../../components/ui/SearchableCombobox';

const UnitOrBranchForm = ({
    initialData,
    onSubmit,
    onCancel,
    isEditing,
    departments = [],
    regions = [],
    users = []
}) => {
    const { searchResults, loading, hasMore, searchUsers, loadMoreUsers } = useUserSearch();

    const [formData, setFormData] = useState({
        short_code: '',
        name: '',
        type: 'unit',
        department_id: '',
        region_id: '',
        manager: null,
        regional_manager: null,
        branch_manager: null,
        relationship_manager: null,
        branch_operations_manager: null,
        manager_distribution: null,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                short_code: initialData.short_code || '',
                name: initialData.name || '',
                type: initialData.type || 'unit',
                department_id: initialData.department?.id || '',
                region_id: initialData.region?.id || '',
                manager: initialData.manager || null,
                regional_manager: initialData.regional_manager || null,
                branch_manager: initialData.branch_manager || null,
                relationship_manager: initialData.relationship_manager || null,
                branch_operations_manager: initialData.branch_operations_manager || null,
                manager_distribution: initialData.manager_distribution || null,
            });
        } else {
            setFormData({
                short_code: '',
                name: '',
                type: 'unit',
                department_id: '',
                region_id: '',
                manager: null,
                regional_manager: null,
                branch_manager: null,
                relationship_manager: null,
                branch_operations_manager: null,
                manager_distribution: null,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.short_code.trim()) newErrors.short_code = 'Short Code is required.';
        if (!formData.name.trim()) newErrors.name = 'Name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const submissionData = {
                short_code: formData.short_code,
                name: formData.name,
                type: formData.type,
                department_id: formData.department_id || null,
                region_id: formData.region_id || null,
                manager_id: formData.manager?.id || null,
                regional_manager_id: formData.regional_manager?.id || null,
                branch_manager_id: formData.branch_manager?.id || null,
                relationship_manager_id: formData.relationship_manager?.id || null,
                branch_operations_manager_id: formData.branch_operations_manager?.id || null,
                manager_distribution_id: formData.manager_distribution?.id || null,
            };
            onSubmit(submissionData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Short Code <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        name="short_code"
                        value={formData.short_code}
                        onChange={handleChange}
                        className={`mt-1 ${errors.short_code ? 'border-red-500' : ''}`}
                    />
                    {errors.short_code && <p className="mt-1 text-sm text-red-600">{errors.short_code}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name <span className="text-red-500">*</span></label>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>
                <Select
                    label="Type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="mt-1"
                >
                    <option value="unit">Unit</option>
                    <option value="branch">Branch</option>
                </Select>
                {formData.type === 'unit' && (
                    <>
                        <Select
                            label="Department"
                            name="department_id"
                            value={formData.department_id}
                            onChange={handleChange}
                            className="mt-1"
                        >
                            <option value="">-- Select Department --</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>{dept.name}</option>
                            ))}
                        </Select>
                        <SearchableCombobox
                            label="Manager"
                            options={searchResults}
                            selected={formData.manager}
                            onChange={(selectedUser) => setFormData({ ...formData, manager: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Manager..."
                        />
                    </>
                )}
                {formData.type === 'branch' && (
                    <>
                        <Select
                            label="Region"
                            name="region_id"
                            value={formData.region_id}
                            onChange={handleChange}
                            className="mt-1"
                        >
                            <option value="">-- Select Region --</option>
                            {regions.map(region => (
                                <option key={region.id} value={region.id}>{region.name}</option>
                            ))}
                        </Select>
                        <SearchableCombobox
                            label="Regional Manager"
                            options={searchResults}
                            selected={formData.regional_manager}
                            onChange={(selectedUser) => setFormData({ ...formData, regional_manager: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Regional Manager..."
                        />
                        <SearchableCombobox
                            label="Branch Manager"
                            options={searchResults}
                            selected={formData.branch_manager}
                            onChange={(selectedUser) => setFormData({ ...formData, branch_manager: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Branch Manager..."
                        />
                        <SearchableCombobox
                            label="Relationship Manager"
                            options={searchResults}
                            selected={formData.relationship_manager}
                            onChange={(selectedUser) => setFormData({ ...formData, relationship_manager: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Relationship Manager..."
                        />
                        <SearchableCombobox
                            label="Branch Operations Manager"
                            options={searchResults}
                            selected={formData.branch_operations_manager}
                            onChange={(selectedUser) => setFormData({ ...formData, branch_operations_manager: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Branch Operations Manager..."
                        />
                        <SearchableCombobox
                            label="Manager Distribution"
                            options={searchResults}
                            selected={formData.manager_distribution}
                            onChange={(selectedUser) => setFormData({ ...formData, manager_distribution: selectedUser })}
                            onSearch={searchUsers}
                            onLoadMore={loadMoreUsers}
                            hasMore={hasMore}
                            loading={loading}
                            placeholder="Type to search for a Manager Distribution..."
                        />
                    </>
                )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" variant="pride">
                    {isEditing ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
};

export default UnitOrBranchForm;
