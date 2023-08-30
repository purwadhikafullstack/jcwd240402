import { Label, TextInput } from "flowbite-react";
import React from "react";

const InputForm = ({
  errorMessage,
  placeholder = "input placeholder",
  type = "text",
  label,
  width,
  name = "",
  value = "",
  onChange,
}) => {
  const isError = Boolean(errorMessage);
  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor={label} value={label} />
      </div>
      <TextInput
        color={isError ? "failure" : null}
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
      {isError && <div className="text-red-500 text-sm">{errorMessage}</div>}
    </div>
  );
};

export default InputForm;
