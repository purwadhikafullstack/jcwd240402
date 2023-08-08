import React from "react";

const Button = ({
  buttonSize,
  buttonText = "Edit Button",
  onClick,
  bgColor,
  colorText,
  fontWeight,
}) => {
  let sizeClasses;

  switch (buttonSize) {
    case "small":
      sizeClasses = "px-2 py-1 text-xs w-24 h-8 rounded-lg";
      break;
    case "medium":
      sizeClasses = "px-4 py-2 text-sm w-32 h-10 rounded-lg";
      break;
    case "large":
      sizeClasses = "px-6 py-3 text-lg w-40 h-12 rounded-lg";
      break;
    default:
      sizeClasses = "px-4 py-2 text-sm w-32 h-10 rounded-lg";
      break;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bgColor} ${fontWeight} text-center ${colorText} rounded-lg hover:border-black hover:border-2 transition duration-200 ${sizeClasses}`}
    >
      {buttonText}
    </button>
  );
};

export default Button;
