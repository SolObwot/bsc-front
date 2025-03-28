import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const SensitiveData = ({ data, autoHideTimeout = 5000, maskChar = '•' }) => {
    // console.log('SensitiveData Props:', { data, autoHideTimeout }); // Log props to verify input
    const [isVisible, setIsVisible] = useState(false);

    // Auto-hide after timeout
    useEffect(() => {
        let timeoutId;
        if (isVisible) {
            timeoutId = setTimeout(() => {
                setIsVisible(false);
            }, autoHideTimeout);
        }
        return () => clearTimeout(timeoutId);
    }, [isVisible, autoHideTimeout]);

    // Ensure data is a string before masking
    const stringData = data != null ? String(data) : '';
    const maskedData = stringData.split('').map(() => maskChar).join('');

    // console.log('Rendering SensitiveData with data:', stringData); // Log to confirm rendering
    // console.log('Masked Data:', maskedData); // Log masked data
    // console.log('Is Visible:', isVisible); // Log visibility state

    return (
        <div className="flex items-center gap-2">
            <span>{isVisible ? stringData : maskedData}</span>
            <button
                onClick={() => {
                    // console.log('Toggling visibility:', !isVisible); // Log visibility toggle
                    setIsVisible(!isVisible);
                }}
                className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
            >
                {isVisible ? (
                    <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <EyeIcon className="h-5 w-5" aria-hidden="true" />
                )}
            </button>
        </div>
    );
};

export default SensitiveData;