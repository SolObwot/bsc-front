import React from 'react';

const EmailTruncator = ({ email, showChars = 8, suffix = '...' }) => {
    if (!email) return <span>N/A</span>;

    const truncateEmail = (email) => {
        const [username, domain] = email.split('@');
        if (!domain) return email;

        const truncatedUsername = username.length > showChars 
            ? `${username.slice(0, showChars)}${suffix}`
            : username;

        const [domainName, extension] = domain.split('.');
        const truncatedDomain = `${domainName.charAt(0)}${suffix}`;

        return `${truncatedUsername}@${truncatedDomain}${extension ? `.${extension}` : ''}`;
    };

    return <span title={email}>{truncateEmail(email)}</span>;
};

export default EmailTruncator;
