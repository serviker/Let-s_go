import React from 'react';

export default function SelectInput({ id, value, onChange, className, children }) {
    return (
        <select id={id} value={value} onChange={onChange} className={className}>
            {children}
        </select>
    );
}
