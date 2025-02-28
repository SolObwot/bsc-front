import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';

const SensitiveData = ({ data, autoHideTimeout = 5000, maskChar = '•' }) => {
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

    // Mask the data if not visible
    const maskedData = data ? data.split('').map(() => maskChar).join('') : '';

    return (
        <div className="flex items-center gap-2">
            <span>{isVisible ? data : maskedData}</span>
            <button
                onClick={() => setIsVisible(!isVisible)}
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