import { useEffect, useState } from "react";

const EditableField = ({
  type = "text",
  value: initialValue,
  onSave,
  onCancel,
  editing = false,
  onEditingChange,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(editing);

  useEffect(() => {
    setValue(initialValue);
    setIsEditing(editing);
  }, [initialValue, editing]);

  const handleSave = () => {
    onSave(value);
    onEditingChange(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    if (onCancel) onCancel();
  };

  return isEditing ? (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="p-2 border rounded text-base bg-white shadow-sm"
        {...props}
      />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  ) : (
    <div onClick={() => onEditingChange(true)}>
      {initialValue || "Click to edit"}
    </div>
  );
};

export default EditableField;
