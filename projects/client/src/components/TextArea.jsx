import React from 'react';
import { Label, TextInput } from 'flowbite-react';

const TextAreaForm = ({
  errorMessage,
  label,
  width,
  name,
  value,
  onChange,
  placeholder = '',
}) => {
  const isError = Boolean(errorMessage);

  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor={label} value={label} />
      </div>
      <textarea
        id={name}
        name={name}
        className={`mt-1 p-2 w-full border rounded-md ${
          isError ? 'border-red-500' : 'border-black focus:border-blue-300'
        } resize-none`}
        style={{ height: '200px', overflowY: 'hidden' }}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {isError && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </div>
  );
};

export default TextAreaForm;
