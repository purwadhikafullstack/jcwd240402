import { Label, TextInput } from "flowbite-react";
import React from "react";

const InputForm = ({
  isError = false,
  errorMessage,
  placeholder = "input placeholder",
  type = "text",
  label,
  width,
  name = "",
  value = "",
  onChange,
}) => {
  return (
    <div className={`${width}`}>
      <div className="block">
        <Label htmlFor={label} value={label} />
      </div>
      <TextInput
        color={isError ? "failure" : null}
        helperText={isError ? errorMessage : null}
        placeholder={placeholder}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputForm;
