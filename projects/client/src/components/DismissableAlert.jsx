import React, { useState } from "react";
import { Alert } from "flowbite-react";

export default function DismissableAlert({ successMsg }) {
  const [showAlert, setShowAlert] = useState(true);

  const handleDismiss = () => {
    setShowAlert(false);
  };

  return (
    showAlert && (
      <Alert color="success" onDismiss={handleDismiss}>
        <span>
          <p>
            <span className="font-medium">Info alert!</span>
            {successMsg}
          </p>
        </span>
      </Alert>
    )
  );
}
