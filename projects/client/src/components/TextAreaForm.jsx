import { Label, Textarea } from "flowbite-react";
import React from "react";

const TextAreaForm = ({
  errorMessage,
  placeholder = "textarea placeholder",
  label,
  width,
  name = "",
  value = "",
  onChange,
  rows = 7,
}) => {
  const isError = Boolean(errorMessage);
  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor={label} value={label} />
      </div>
      <Textarea
        className={`resize-none text-sm font-poppins ${
          isError ? "text-failure" : ""
        } text-inherit font-inherit`}
        color={isError ? "failure" : null}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
      />
      {isError && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </div>
  );
};

export default TextAreaForm;