import { Label, TextInput } from "flowbite-react";
import React from "react";

const InputForm = ({
  isError = false,
  errorMessage,
  placeholder = "input placeholder",
  type = "text",
  label,
  width,
}) => {
  return (
    <div className={`${width}`}>
      <div className="mb-2 block">
        <Label htmlFor={label} value={label} />
      </div>
      <TextInput
        color={isError ? "failure" : null}
        helperText={isError ? errorMessage : null}
        required
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
};

export default InputForm;
