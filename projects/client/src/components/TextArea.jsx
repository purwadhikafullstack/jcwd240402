import React from 'react';

const TextArea = ({ label, name, value, onChange, placeholder = '' }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className="mt-1 p-2 w-full border rounded-md focus:ring focus:border-blue-300 resize-none"
        style={{ height: '200px', overflowY: 'hidden' }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextArea;

