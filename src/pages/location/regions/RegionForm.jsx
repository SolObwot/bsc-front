import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import useUserSearch from '../../../hooks/agreements/useUserSearch';
import SearchableCombobox from '../../../components/ui/SearchableCombobox';

const RegionForm = ({ initialData, onSubmit, onCancel, isModal = false, isEditing = false }) => {
    const { searchResults, loading, hasMore, searchUsers, loadMoreUsers } = useUserSearch();

    const [formData, setFormData] = useState({
        short_code: '',
        name: '',
        regional_manager: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                short_code: initialData.short_code || '',
                name: initialData.name || '',
                regional_manager: initialData.regional_manager || null,
            });
        } else {
            setFormData({
                short_code: '',
                name: '',
                regional_manager: null,
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
        if (!formData.name.trim()) newErrors.name = 'Region Name is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        try {
            const submissionData = {
                short_code: formData.short_code,
                name: formData.name,
                regional_manager_id: formData.regional_manager?.id || null,
                regional_manager: formData.regional_manager,
            };
            await onSubmit(submissionData);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium text-gray-700">Region Name <span className="text-red-500">*</span></label>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`mt-1 ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
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
            
            <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="pride" disabled={isSubmitting}>
                    {isEditing ? 'Update Region' : 'Create Region'}
                </Button>
            </div>
        </form>
    );
};

export default RegionForm;
